class Content
{
    constructor(element)
    {
        this.el = element;
    }
}

class Sidebar
{
    constructor(element)
    {
        this.el = element;
    }
}

class Report
{
    constructor()
    {
        this.analysis_tool = null;
        this.target = null;
        this.constraint = null;
        this.target_metric = null;
        this.target_metric_name = null;
        this.target_time = null;
    }

    configureAnalysisTool()
    {
        if(USER_CONCERN.analysis.tool === "JMeter")
        {
            this.analysis_tool = new JMeterResult(ANALYSIS_DATA);
        }
    }

    /**
     * Reads analysis meta data from the user concern and creates a section with general information.
     */
    experimentDescription()
    {
        if(USER_CONCERN.query.type === "loadtest")
        {
            let start_time = parseFloat(this.analysis_tool.data[0]["timeStamp"]);
            let stop_time = parseFloat(this.analysis_tool.data[objLength(this.analysis_tool.data) - 1]["timeStamp"]);
            let start = date(start_time, "%d.%m %H:%M:%S");
            let end = date(stop_time, "%d.%m %H:%M:%S");
            let duration = time(stop_time - start_time, "%d days %H hours %M minutes and %S seconds");

            el_content.append($(document.createElement("div"))
                              .append("<h1>Experiment Result</h1>")
                              .append("<hr><br>")
                              .append("<h3>Configuration and Analysis</h3>")
                              .append("<hr>")
                              .append("<p>The chosen Analysis tool was " + linkSidebar(USER_CONCERN.analysis.tool) + ".<br> " +
                              "The experiment was performed on " + bold(USER_CONCERN.analysis.meta.domain) + ".<br>" +
                              "The experiment started at " + bold(start) + " and ended at " + bold(end) + ".<br> " +
                              "The inspected metrics were recoreded over the course of " + bold(duration) + ".<br> " +
                              "The " + linkSidebar("loadtest") + " was done with a load of " + bold(USER_CONCERN.analysis.meta.load) + " users."));
        }
    }

    /**
     * Tries to answer the query.
     */
    queryDescription()
    {
        let query_desc = $(document.createElement("div"))
        .append("<h4>" + $("#query").text() + "</h4>");

        let format = USER_CONCERN.query.format;
        let parameters = USER_CONCERN.query.parameters;

        let constraint_time = 1, constraint_limit = "", constraint_metric = "";
        let constraint_condition = "", constraint_value = null;
        let desired_metric = null, desired_value, desired_unit, desired_limit, desired_condition;

        this.target_metric = parameters[USER_CONCERN.query.target];
        this.target_metric_name = CONVERSION.metric[this.target_metric];

        for(let parameter in parameters)
        {
            if(/Metric\d*/.test(USER_CONCERN.query.constraint))
            {
                if(/Condition\d*/.test(parameter))
                {
                    desired_condition = parameters[parameter];
                    constraint_condition = desired_condition;
                }
                else if(/Metric\d*/.test(parameter))
                {
                    desired_metric = parameters[parameter];
                    constraint_metric = CONVERSION.metric[desired_metric];
                }
                else if(/Value\d*/.test(parameter))
                {
                    constraint_value = parameters[parameter];
                }
            }
            else if(/Value\d*/.test(USER_CONCERN.query.constraint))
            {
                if(/Unit\d*/.test(parameter))
                {
                    desired_unit = parameters[parameter];
                    constraint_time *= CONVERSION.unit[parameters[parameter]];
                }
                else if(/Value\d*/.test(parameter))
                {
                    desired_value = parameters[parameter];
                    constraint_time *= parameters[parameter];
                }
            }

            if(/Limit\d*/.test(parameter))
            {
                desired_limit = parameters[parameter];
                constraint_limit = CONVERSION.limit[desired_limit];
            }

            format = format.replace(parameter, parameters[parameter]);
        }

        if(this.target_metric !== "")
        {
            let answer = null;
            if(/Metric\d*/.test(USER_CONCERN.query.constraint))
            {
                answer = this.analysis_tool.getMetricByFilter(this.target_metric_name,
                                                              constraint_metric,
                                                              constraint_condition,
                                                              constraint_value,
                                                              constraint_limit);
            }
            else if(/Value\d*/.test(USER_CONCERN.query.constraint))
            {
                this.target_time = constraint_time;
                answer = this.analysis_tool.getMetricTillTime(this.target_metric_name,
                                                              constraint_time,
                                                              constraint_limit);
            }
            if(answer !== null)
            {
                format = bgood(format.replace("$1", underline(answer) + METRICS[this.target_metric_name].unit));
            }
            else
            {
                format = bbad("Please check your concern configuration.");
            }
        }
        else
        {
            format = bubad(USER_CONCERN.analysis.tool + " cannot tell anything about " + this.target_metric + ".");
        }

        query_desc.append(format);
        el_content.append($(document.createElement("div"))
                          .append("<h3>Query</h3>")
                          .append("<hr>")
                          .append('<div class="p-section">' + query_desc.html() + '</div>'));
    }

    toolMetrics()
    {
        this.analysis_tool.getTopic(this.target_metric_name);

        for(let key in this.analysis_tool.metrics)
        {
            if(key !== this.target_metric_name)
            {
                this.analysis_tool.getTopic(key);
            }
        }
    }

    createReport()
    {
        this.constraint = USER_CONCERN.query.constraint;
        this.target = USER_CONCERN.query.target;

        this.experimentDescription();
        this.queryDescription();
        this.toolMetrics();
    }
}

/**
 * Abstract Class
 */
class AnalysisTool
{
    constructor()
    {
        this.data = null;
        this.processed = {};
        this.metrics = {};
        this.constraint = null;
        this.series = [];
    }
}

class JMeterResult extends AnalysisTool
{
    constructor(data)
    {
        super();
        if(typeof data === "string")
        {
            data = parseCSV(data);
        }
        this.headers = data.headers;
        delete data.headers;
        this.data = data;
        this.sorted = objSort(this.data, "timeStamp");
        this.metrics = {
            "Latency":    "Latency",
            "allThreads": "number of Threads (Users)",
            "Connect":    "Connection Time"
        };
        this.process();
    }

    process()
    {
        for(let metric in this.metrics)
        {
            this.processed[metric] = {};

            let metric_vals = objValues(this.sorted, true, "timeStamp", metric);
            let min_metric_time = seriesMin(metric_vals, false, true);
            let avg_metric_val = objAvg(metric_vals, true, false);
            let max_metric_time = seriesMax(metric_vals, false, true);

            this.processed[metric]["min"] = metric_vals[min_metric_time];
            this.processed[metric]["min_time"] = min_metric_time;
            this.processed[metric]["avg"] = avg_metric_val;
            this.processed[metric]["max"] = metric_vals[max_metric_time];
            this.processed[metric]["max_time"] = max_metric_time;
        }
    }

    getMetricTillTime(metric, time, what)
    {
        let data = this.sorted;

        let first = parseFloat(data[0]["timeStamp"]);
        let last = first;
        let values = [];
        for(let i = 0; i < objLength(data); ++i)
        {
            last = parseFloat(data[i][metric]);

            if(parseFloat(data[i]["timeStamp"]) - first > time || i === objLength(data) - 1)
            {
                if(i === objLength(data) - 1)
                {
                    values.push(parseFloat(data[i][metric]));
                }

                if(what === undefined)
                {
                    return parseFloat(data[Math.max(0, i - 1)][metric]);
                }
                else
                {
                    if(what === "min")
                    {
                        return objMin(values, false, false);
                    } else if(what === "avg")
                    {
                        return objAvg(values, false, false);
                    } else if(what === "max")
                    {
                        return objMax(values, false, false);
                    }
                }
            }
            values.push(parseFloat(data[i][metric]));
        }
        return parseFloat(data[0][metric]);
    }

    getMetricByFilter(metric, filter_metric, filter_cond, filter_val, what)
    {
        let data = this.sorted;

        let values = [];
        let cond = CONVERSION.condition[filter_cond];
        for(let i = 0; i < objLength(data); ++i)
        {
            if(cond(parseFloat(data[i][filter_metric]), filter_val))
            {
                values.push(parseFloat(data[i][metric]));
            }
        }

        if(values.length > 0)
        {
            if(what === "min")
            {
                return objMin(values, false, false);
            } else if(what === "avg")
            {
                return objAvg(values, false, false);
            } else if(what === "max")
            {
                return objMax(values, false, false);
            }
        }

        return parseFloat(data[0][metric]);
    }

    getTopic(metric)
    {
        if(this.metrics[metric])
        {
            el_content.append($(document.createElement("div"))
                              .append("<h3>" + this.metrics[metric] + "</h3>")
                              .append("<hr>"));

            this.getDiagram(metric);
            this.getDefinition(metric);
            this.getText(metric);
        }
    }

    getDefinition(metric)
    {
        el_content.append("<b>" + this.metrics[metric] + ":</b><p>" + METRICS[metric].definition + "</p>");
    }

    getText(metric)
    {
        let metric_name = this.metrics[metric];
        let metric_min = this.processed[metric].min;
        let metric_min_time = this.processed[metric].min_time;
        let metric_avg = this.processed[metric].avg;
        let metric_max = this.processed[metric].max;
        let metric_max_time = this.processed[metric].max_time;

        el_content.append("<p>The " + bgood("minimum") + " " + metric_name + " was " + bgood(metric_min) + METRICS[metric].unit + " at " + bold(date(metric_min_time)) + ".<br> " +
        "The " + bcolor("average", "orange") + " " + metric_name + " was " + bcolor(metric_avg, "orange") + METRICS[metric].unit + ".<br> " +
        "The " + bbad("maximum") + " " + metric_name + " was " + bbad(metric_max) + METRICS[metric].unit + " at " + bold(date(metric_max_time)) + ".<br> ")
                  .append('<div id="sparkline' + metric + '" class="sparkline"></div>');

        Highcharts.SparkLine("sparkline" + metric,
        "scatter",
        {
            series:  [
                {
                    name: this.metrics[metric],
                    data: objValues(this.sorted, true, metric)
                }
            ],
            tooltip: {
                formatter: function()
                           {
                               return '<div style="color:' + this.series.color + '">●</div> <b>' +
                               this.series.name + "</b>:<br>    " +
                               this.y + METRICS[metric].unit;
                           }
            }
        });

    }

    getDiagram(metric)
    {
        let id = (this.metrics[metric] + USER_CONCERN.analysis.tool).toLowerCase().replace(" ", "-");
        el_content.append(chartContainer(this.metrics[metric], id));
        let extremes = [
            {
                value:     this.processed[metric].min,
                color:     'green',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'minimum ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].avg,
                color:     'orange',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'average ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].max,
                color:     'red',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'maximum ' + this.metrics[metric], useHTML: true}
            }, /Metric\d*/.test(report.constraint) && metric === CONVERSION.metric[USER_CONCERN.query.parameters[report.constraint]] ? {
                value:     USER_CONCERN.query.parameters["Value"],
                color:     'blue',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    101,
                label:     {text: 'threshold', useHTML: true}
            } : {}
        ];
        let time = report.target_time === null ? [] : [
            {
                color: '#FCFFC5',
                from:  0,
                to:    parseInt(report.target_time) + parseInt(this.sorted[0]["timeStamp"])
            }
        ];
        this.series[metric] = this.getSeries(metric, "timeStamp", this.data[1]["threadName"].split(" ")[0]);

        let min = parseInt(this.sorted[0]["timeStamp"]);
        let max = (report.target_time === null) ? undefined : min + parseInt(report.target_time);
        let unit_text = METRICS[metric].unit;
        let unit = METRICS[metric].unit === "" ? "" : "[" + METRICS[metric].unit + "]";

        Highcharts.setOptions(STOCK_OPTIONS);
        Highcharts.stockChart(id, {
            series:  [this.series[metric]],
            yAxis:   {
                title:     {text: this.metrics[metric] + " " + unit},
                plotLines: extremes
            },
            xAxis:   {
                plotBands: time,
                min:       min,
                max:       max
            },
            legend:  {enabled: true},
            tooltip: {
                borderWidth:     0,
                backgroundColor: "rgba(255,255,255,0)",
                shadow:          false,
                useHTML:         true,
                formatter:       function()
                                 {
                                     let d = new Date(this.x);
                                     let D = d.getDate();
                                     let M = d.getMonth() + 1;
                                     let h = d.getHours();
                                     let m = d.getMinutes();
                                     let s = d.getSeconds();
                                     let ms = Math.round(d.getMilliseconds() / 10);
                                     return "<b>Timestamp</b>: " + D + "." + M + " " + h + ":" + m + ":" + s + "." + ms +
                                     "<br><b>" + this.points[0].series.name + "</b>: " + this.y.toFixed(0) + unit_text;
                                 }
            }
        });
    }

    getSeries(key, format, name)
    {
        let series = {name: name, data: []};

        if(format !== undefined)
        {
            let last = null;
            for(let index = 0; index < objLength(this.sorted); ++index)
            {
                let x = parseFloat(this.sorted[index][format]);
                let y = parseFloat(this.sorted[index][key]);
                if(last < x - 3600000 && last !== null)
                {
                    series.data.push([last + (x - last) / 2, null]);
                }
                series.data.push([x, y]);
                last = x;
            }
        }
        return series;
    }
}

class BenchFlowResult
{
    constructor()
    {

    }
}

function loadUserConcern(json)
{
    USER_CONCERN = JSON.parse(json);
    query.setQuery(USER_CONCERN.query.text);
    query.setQueryBadgeValues();

    el_content.html("");
    el_sidebar.html("");
}

function loadAnalysisData(format)
{
    el_loader.show();

    ANALYSIS_DATA = format;

    report.configureAnalysisTool();

    el_content.html("");
    el_sidebar.html("");

    if(!query.incomplete())
    {
        report.createReport();
    }

    el_loader.hide();
}

$(window).on("queryChanged", function()
{
    el_content.html("");
    el_sidebar.html("");

    if(report.analysis_tool !== null)
    {
        el_loader.show();
        if(!query.incomplete())
        {
            report.createReport();
        }
        el_loader.hide();
    }
});
