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
                              .append("<p>The chosen Analysis tool was " + linkSidebar(USER_CONCERN.analysis.tool) + "</p>")
                              .append("<p>The experiment was performed on " + bold(USER_CONCERN.analysis.meta.domain) + "</p>")
                              .append("<p>The experiment started at " + bold(start) + " and ended at " + bold(end) + ".</p>")
                              .append("<p>The inspected metrics were recoreded over the course of " + bold(duration) + ".</p>")
                              .append("<p>The " + linkSidebar("loadtest") + " was done with a load of " + bold(USER_CONCERN.analysis.meta.load) + " users."));

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
        let limit = USER_CONCERN.query.parameters["Limit"];
        let metric = USER_CONCERN.query.parameters["Metric"];
        let value = USER_CONCERN.query.parameters["Value"];
        let unit = USER_CONCERN.query.parameters["Unit"];

        format = format.replace("Limit", limit)
                       .replace("Metric", metric)
                       .replace("Service", USER_CONCERN.query.parameters["Service"])
                       .replace("Value", value)
                       .replace("Unit", unit);

        if(CONVERSION.metric[metric] !== "")
        {
            let answer = this.analysis_tool.getMetricAtTime(CONVERSION.metric[metric],
                                                            value * CONVERSION.unit[unit],
                                                            CONVERSION.limit[limit]);

            format = bgood(format.replace("$1", underline(answer)));
        }
        else
        {
            format = bubad(USER_CONCERN.analysis.tool + " cannot tell anything about " + metric + ".");
        }

        query_desc.append(format);
        el_content.append($(document.createElement("div"))
                          .append("<h3>Query</h3>")
                          .append("<hr>")
                          .append("<div class='p-section'>" + query_desc.html() + "</div>"))
        .append();
    }

    toolMetrics()
    {
        for(let key in this.analysis_tool.metrics)
        {
            this.analysis_tool.getTopic(key);
        }
    }

    createReport()
    {
        this.experimentDescription();
        this.queryDescription();
        this.toolMetrics();
    }
}

/**
 * Abstract Class
 */
class Result
{
    constructor()
    {
        this.data = null;
        this.processed = {};
        this.metrics = {};
    }
}

class JMeterResult extends Result
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
        this.metrics = {"Latency": "Latency", "Connect": "Connection Time"};
        this.process();
    }

    process()
    {
        for(let metric in this.metrics)
        {
            this.processed[metric] = {};

            let metric_vals = objValues(this.data, true, "timeStamp", metric);
            let series = this.getSeries("timeStamp", metric, "");
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

    getMetricAtTime(metric, time, what)
    {
        let data = objSort(this.data, "timeStamp");

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
                        return objMin(values, false, false);
                    else if(what === "avg")
                        return objAvg(values, false, false);
                    else if(what === "max")
                        return objMax(values, false, false);
                }
            }
            values.push(parseFloat(data[i][metric]));
        }
        return parseFloat(data[0][metric]);
    }

    getTopic(metric)
    {
        el_content.append($(document.createElement("div"))
                          .append("<h3>" + metric + "</h3>")
                          .append("<hr>"));

        this.getDiagram(metric);
        this.getText(metric);
    }

    getText(metric)
    {
        let metric_name = this.metrics[metric];
        let metric_min = this.processed[metric].min;
        let metric_min_time = this.processed[metric].min_time;
        let metric_avg = this.processed[metric].avg;
        let metric_max = this.processed[metric].max;
        let metric_max_time = this.processed[metric].max_time;
        el_content.append("<p>The " + bgood("minimum") + " " + metric_name + " was " + bgood(metric_min) + " ms at " + bold(date(metric_min_time)) + ".</p>")
                  .append("<p>The " + bcolor("average", "orange") + " " + metric_name + " was " + bcolor(metric_avg, "orange") + " ms.</p>")
                  .append("<p>The " + bbad("maximum") + " " + metric_name + " was " + bbad(metric_max) + " ms at " + bold(date(metric_max_time)) + ".</p>");

    }

    getDiagram(metric)
    {
        let id = (this.metrics[metric] + USER_CONCERN.analysis.tool).toLowerCase().replace(" ", "-");
        el_content.append(chartContainer(this.metrics[metric], id));

        let series;
        let extremes = [
            {
                value:     this.processed[metric].min,
                color:     'green',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'minimum ' + this.metrics[metric], y: 10}
            }, {
                value:     this.processed[metric].avg,
                color:     'orange',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'average ' + this.metrics[metric], y: 10}
            }, {
                value:     this.processed[metric].max,
                color:     'red',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'maximum ' + this.metrics[metric]}
            }
        ];

        series = this.getSeries(metric, "timeStamp", USER_CONCERN.analysis.meta.domain);
        Highcharts.setOptions(STOCK_OPTIONS);

        Highcharts.stockChart(id,
                              {
                                  series: [series],
                                  yAxis:  {
                                      title:     {text: metric},
                                      plotLines: extremes
                                  },
                                  legend: {enabled: true}
                              });
    }

    getSeries(key, format, name)
    {
        this.data = objSort(this.data, format);
        let series = {name: name, data: []};

        if(format !== undefined)
        {
            let last = null;
            for(let index = 0; index < objLength(this.data); ++index)
            {
                let x = parseFloat(this.data[index][format]);
                let y = parseFloat(this.data[index][key]);
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
    let first_load = ANALYSIS_DATA === "";

    ANALYSIS_DATA = format;

    if(first_load)
    {
        report.configureAnalysisTool();
    }

    el_content.html("");
    el_sidebar.html("");

    report.createReport();
}

$(window).on("queryChanged", function()
{
    el_content.html("");
    el_sidebar.html("");

    if(report.analysis_tool !== null)
    {
        report.createReport();
    }
});