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
        this.analysis_tool      = null;
        this.target             = null;
        this.constraint         = null;
        this.target_metric      = null;
        this.target_metric_name = null;
        this.target_time        = null;
        this.target_limit       = null;
        this.start_time         = null;
        this.stop_time          = null;
        this.experiment_time    = null;
    }

    configureAnalysisTool()
    {
        if(USER_CONCERN.analysis.tool === "JMeter")
        {
            this.analysis_tool = new JMeterResult(ANALYSIS_DATA);
        }
        else if(USER_CONCERN.analysis.tool === "Locust")
        {
            this.analysis_tool = new LocustResult(ANALYSIS_DATA);
        }
    }

    /**
     * Reads analysis meta data from the user concern and creates a section with general information.
     */
    experimentDescription()
    {
        if(USER_CONCERN.query.type === "loadtest")
        {
            let time_key = "timeStamp";

            this.start_time      = parseFloat(this.analysis_tool.sorted[0][time_key]);
            this.stop_time       = parseFloat(this.analysis_tool.sorted[this.analysis_tool.sorted.length - 2][time_key]);
            let start            = date(this.start_time, "%d.%m %H:%M:%S");
            let end              = date(this.stop_time, "%d.%m %H:%M:%S");
            this.experiment_time = this.stop_time - this.start_time;
            let millis           = this.experiment_time;
            let seconds          = Math.round(millis / 1000);
            let minutes          = Math.round(seconds / 60);
            let hours            = Math.round(seconds / 3600);
            let days             = Math.round(seconds / 86400);


            let tool        = USER_CONCERN.analysis.tool;
            let domain      = USER_CONCERN.analysis.meta.domain;
            let load        = parseInt(USER_CONCERN.analysis.meta.load);
            let loops       = 0;
            let min_wait    = 0;
            let max_wait    = 0;
            let duration    = parseInt(USER_CONCERN.analysis.meta.duration);
            let experiments = this.analysis_tool.multiple ? 1 : 0;

            if(tool === "JMeter")
            {
                loops = parseInt(USER_CONCERN.analysis.meta.loops) + 1;
            }
            else if(tool === "Locust")
            {
                min_wait = parseInt(USER_CONCERN.analysis.meta.min_wait);
                max_wait = parseInt(USER_CONCERN.analysis.meta.max_wait);
            }

            let experiment_description = "" +
                "The configured query did trigger a " + linkSidebar("loadtest") + ". " +
                "The chosen loadtest tool was " + linkSidebar(tool) + ".<br>" +
                tool + " performed the loadtest on the domain " + bold(domain) + " with a load of " + bold(s(load, "user", true)) + ". ";

            experiment_description += "<br> Each User sent ";
            if(loops === 0)
            {
                experiment_description += "requests until the end of the " + s(experiments, "experiment") + ". ";
            }
            else
            {
                experiment_description += "exactly " + bold(s(loops, "request", true)) + ". ";
            }

            if(min_wait !== 0 && max_wait !== 0)
            {
                experiment_description += "<br> Users spent from " + s(min_wait / 1000, " second", true) +
                    " to " + s(max_wait / 1000, " second", true) + " on the page. ";
            }

            // if(this.analysis_tool.multiple)
            // {
            //     experiment_description += "<br>The evaluation result contains more than one experiment. "
            // }
            // else
            // {
            //     experiment_description += "<br>The experiment execution took " + bold(s(duration, "second", true)) + ". "
            // }

            experiment_description += "The evaluation started at " + bold(start) + " and ended at " + bold(end) + ".<br> ";

            let metrics = this.analysis_tool.metrics;
            experiment_description += tool + " collected the following metrics: <br><ul>";
            for(let metric in metrics)
            {
                experiment_description += "<li>" + metrics[metric] + "</li>";
            }

            let duration_text = "";
            if(days > 0)
            { duration_text += s(days % 365, "day", true) + " " }
            if(hours > 0)
            { duration_text = and(duration_text) + s(hours % 24, "hour", true) + " " }
            if(minutes > 0)
            { duration_text = and(duration_text) + s(minutes % 60, "minute", true) + " " }
            if(seconds > 0)
            { duration_text = and(duration_text) + s(seconds % 60, "second", true) + " " }
            if(millis > 0)
            { duration_text = and(duration_text) + s(millis % 1000, "millisecond", true) + " " }

            experiment_description += "</ul><br>The inspected metrics were recoreded over the course of " + bold(duration_text) + ".<br> "
            + "During this time " + bold(this.analysis_tool.data.length) + " requests were saved to the analysis result.<br ";

            el_content.append($(document.createElement("div"))
                .append("<h1>Experiment Result</h1>")
                .append("<hr><br>")
                .append("<h3>Configuration and Analysis</h3>")
                .append("<hr>")
                .append("<p>" + experiment_description + "</p>"));
        }
    }

    /**
     * Tries to answer the query.
     */
    queryDescription()
    {
        let query_desc = $(document.createElement("div"))
            .append("<h4>" + $("#query").text() + "</h4>");

        let format     = USER_CONCERN.query.format;
        let parameters = USER_CONCERN.query.parameters;

        let constraint_time      = 1, constraint_limit = "", constraint_metric = "";
        let constraint_condition = "", constraint_value = null;
        let desired_metric       = null, desired_value, desired_unit, desired_limit, desired_condition;

        this.target_metric      = parameters[USER_CONCERN.query.target];
        this.target_metric_name = CONVERSION.metric[this.target_metric];

        for(let parameter in parameters)
        {
            if(/Metric\d*/.test(USER_CONCERN.query.constraint))
            {
                if(/Condition\d*/.test(parameter))
                {
                    desired_condition    = parameters[parameter];
                    constraint_condition = desired_condition;
                }
                else if(/Metric\d*/.test(parameter))
                {
                    desired_metric    = parameters[parameter];
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
                desired_limit    = parameters[parameter];
                constraint_limit = CONVERSION.limit[desired_limit];
                if(desired_limit === "maximum" || desired_limit === "minimum")
                {
                    this.target_limit = desired_limit;
                }
            }

            format = format.replace(parameter, parameters[parameter]);
        }

        if(this.target_metric !== "" && this.analysis_tool.metrics[CONVERSION.metric[this.target_metric]])
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
                answer           = this.analysis_tool.getMetricTillTime(this.target_metric_name,
                    constraint_time,
                    constraint_limit);
            }
            if(answer !== null)
            {
                if(!parseFloat(answer))
                {
                    format = bbad("Metric is not recorded continuously. '" + desired_limit + "' can not be calculated.");
                }
                else
                {
                    format = good(format.replace("$1", link(bgood(answer), this.target_metric_name) + METRICS[this.target_metric_name].unit));
                }
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

        el_content.append("<br><br><br><br><hr><br><br><br><br>");

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
        this.target     = USER_CONCERN.query.target;

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
        this.headers    = null;
        this.data       = null;
        this.sorted     = null;
        this.processed  = {};
        this.metrics    = {};
        this.constraint = null;
        this.multiple   = false;
        this.series     = [];
    }

    getMetricByTimeFilter(metric, from, to)
    {

    }

    getDiagram()
    {

    }

    compare(a, b)
    {
        let t1 = a["timeStamp"], t2 = b["timeStamp"];
        if(t1 < t2)
        { return -1; }
        else if(t1 > t2)
        { return 1; }
        return 0;
    }

    getMetricByFilter(metric, filter_metric, filter_cond, filter_val, what)
    {
        let data = this.sorted;

        let values = [];
        let cond   = CONVERSION.condition[filter_cond];
        for(let i = 0; i < data.length; ++i)
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
            }
            else if(what === "avg")
            {
                return objAvg(values, false, false);
            }
            else if(what === "max")
            {
                return objMax(values, false, false);
            }
        }

        return parseFloat(data[0][metric]) * 100 / 100;
    }

    getTopic(metric)
    {
        if(this.metrics[metric])
        {
            el_content.append($(document.createElement("div"))
                .append("<h3 id='" + metric + "'>" + this.metrics[metric] + "</h3>")
                .append("<hr>"));

            this.getDiagram(metric);
            if(!USER_CONCERN.analysis.expert)
            {
                this.getDefinition(metric);
            }
            this.getText(metric);
        }
    }

    getDefinition(metric)
    {
        el_content.append("<b>" + this.metrics[metric] + " (Definition):</b><p>" + METRICS[metric].definition + "</p>");
    }

    getText(metric)
    {
        if(METRICS[metric].type === "spline")
        {
            let metric_name     = this.metrics[metric];
            let metric_min      = this.processed[metric].min;
            let metric_min_time = this.processed[metric].min_time;
            let metric_avg      = this.processed[metric].avg;
            let metric_max      = this.processed[metric].max;
            let metric_max_time = this.processed[metric].max_time;

            let sparkline_time = Math.min(report.experiment_time * 0.05, 100);
            let min_time_left  = parseInt(metric_min_time) - sparkline_time;
            let min_time_right = parseInt(metric_min_time) + sparkline_time;
            let max_time_left  = parseInt(metric_max_time) - sparkline_time;
            let max_time_right = parseInt(metric_max_time) + sparkline_time;

            let content = "" +
                "The " +
                bugood(sparkline(metric, "minimum " + metric_name, this.getMetricByTimeFilter(metric, min_time_left, min_time_right))) +
                " was " + bgood(metric_min) + METRICS[metric].unit + " at " +
                bold(date(metric_min_time)) + ".<br> " +
                "The " + bcolor("average", "orange") + " " + metric_name + " was " +
                bcolor(metric_avg, "orange") + METRICS[metric].unit + ".<br> " +
                "The " +
                bubad(sparkline(metric, "maximum " + metric_name, this.getMetricByTimeFilter(metric, max_time_left, max_time_right))) +
                " was " + bbad(metric_max) + METRICS[metric].unit + " at " +
                bold(date(metric_max_time)) + ".<br>";

            el_content.append("<p>" + content + "</p>")
        }
    }

    getSeries(key, format, name, type)
    {
        let series = {name: name, data: [], dataGrouping: {enabled: false}};

        if(type === "spline")
        {
            if(format !== undefined)
            {
                let last  = null;
                for(let index = 0; index < this.sorted.length - 1; ++index)
                {
                    let x = parseFloat(this.sorted[index][format]);
                    let y = parseFloat(this.sorted[index][key]);
                    if(last < x - 3600000 && last !== null)
                    {
                        series.data.push([last + (x - last) / 2, null]);
                        this.multiple = true;
                    }
                    series.data.push([x, y]);
                    last = x;
                }
            }
        }
        else if(type === "pie")
        {
            let values = {};
            for(let index = 0; index < this.sorted.length; ++index)
            {
                let name = METRICS[key].convert[this.sorted[index][key]];
                if(values[name])
                {
                    values[name]++;
                }
                else
                {
                    values[name] = 1;
                }
            }

            for(let k in values)
            {
                series.data.push({name: k, y: values[k]});
            }
        }
        else if(type === "area")
        {
            if(format !== undefined)
            {
                let last  = null;
                let y     = 0;
                for(let index = 0; index < this.sorted.length; ++index)
                {
                    let x = parseFloat(this.sorted[index][format]);
                    y += parseFloat(this.sorted[index][key]);
                    if(last < x - 3600000 && last !== null)
                    {
                        series.data.push([last + (x - last) / 2, null]);
                        this.multiple = true;
                    }
                    series.data.push([x, y]);
                    last = x;
                }
            }
        }
        return series;
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
        this.data    = data;
        this.sorted  = data.sort(this.compare);
        this.metrics = {
            "Latency":    "Latency",
            "allThreads": "number of active Threads (Users)",
            "Connect":    "Connection Time",
            "success":    "Successful Request",
            "bytes":      "Traffic"
        };
        this.process();
    }

    process()
    {
        for(let metric in this.metrics)
        {
            this.processed[metric] = {};

            let metric_vals     = objValues(this.sorted, true, "timeStamp", metric);
            let min_metric_time = seriesMin(metric_vals, false, true);
            let avg_metric_val  = objAvg(metric_vals, true, false);
            let max_metric_time = seriesMax(metric_vals, false, true);

            this.processed[metric]["min"]      = metric_vals[min_metric_time];
            this.processed[metric]["min_time"] = min_metric_time;
            this.processed[metric]["avg"]      = avg_metric_val;
            this.processed[metric]["max"]      = metric_vals[max_metric_time];
            this.processed[metric]["max_time"] = max_metric_time;
        }
    }

    getMetricTillTime(metric, time, what)
    {
        let data = this.sorted;

        let first  = parseFloat(data[0]["timeStamp"]);
        let last   = first;
        let values = [];
        for(let i = 0; i < data.length; ++i)
        {
            last = parseFloat(data[i][metric]);

            if(parseFloat(data[i]["timeStamp"]) - first > time || i === data.length - 1)
            {
                if(i === data.length - 1)
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
                    }
                    else if(what === "avg")
                    {
                        return objAvg(values, false, false);
                    }
                    else if(what === "max")
                    {
                        return objMax(values, false, false);
                    }
                }
            }
            values.push(parseFloat(data[i][metric]));
        }
        return Math.round(parseFloat(data[0][metric]) * 100) / 100;
    }

    getMetricByTimeFilter(metric, from, to)
    {
        let data   = this.sorted;
        let values = [];
        for(let i = 0; i < data.length; ++i)
        {
            if(parseInt(data[i]["timeStamp"]) >= from && parseInt(data[i]["timeStamp"]) <= to)
            {
                values.push(parseFloat(data[i][metric]));
            }
        }
        return values;
    }

    getDiagram(metric)
    {
        let target_limit = {};
        let id           = (this.metrics[metric] + USER_CONCERN.analysis.tool).toLowerCase().replace(" ", "-");
        el_content.append(chartContainer(this.metrics[metric], id));

        let y_extremes        = METRICS[metric].type !== "spline" ? [] : [
            {
                value:     this.processed[metric].min,
                color:     '#00C000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'minimum ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].avg,
                color:     '#FF8000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'average ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].max,
                color:     '#FF0000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'maximum ' + this.metrics[metric], useHTML: true}
            }, /Metric\d*/.test(report.constraint) && metric === CONVERSION.metric[USER_CONCERN.query.parameters[report.constraint]] ? {
                value:     USER_CONCERN.query.parameters["Value"],
                color:     '#0080FF',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    101,
                label:     {text: 'threshold', useHTML: true}
            } : {}
        ];
        let x_extremes        = METRICS[metric].type === "pie" ? [] : [
            {
                value:     this.processed[metric].min_time,
                color:     '#00C000',
                width:     2,
                zIndex:    101,
            },
            {
                value:     this.processed[metric].max_time,
                color:     '#FF0000',
                width:     2,
                zIndex:    101,
            }
        ];
        let time            = report.target_time === null || METRICS[metric].type !== "spline" ? [] : [
            {
                color: '#FCFFC5',
                from:  0,
                to:    parseInt(report.target_time) + parseInt(this.sorted[0]["timeStamp"])
            }
        ];
        this.series[metric] = this.getSeries(metric, "timeStamp", this.data[1]["threadName"].split(" ")[0], METRICS[metric].type);

        let min       = parseInt(this.sorted[0]["timeStamp"]);
        let max       = (report.target_time === null) ? undefined : min + parseInt(report.target_time);
        let unit_text = METRICS[metric].unit;
        let unit      = METRICS[metric].unit === "" ? "" : "[" + METRICS[metric].unit + "]";

        Highcharts.setOptions(STOCK_OPTIONS);
        Highcharts.stockChart(id, {
            chart:   {type: METRICS[metric].type},
            series:  [this.series[metric]],
            yAxis:   {
                title:     {text: this.metrics[metric] + " " + unit},
                plotLines: y_extremes
            },
            xAxis:   METRICS[metric].type === "pie" ? {enabled: false} : {
                plotBands: time,
                plotLines: x_extremes,
                min:       min,
                max:       max
            },
            legend:  {enabled: true},
            tooltip: METRICS[metric].type === "pie" ? {enabled: false} : {
                borderWidth:     0,
                backgroundColor: "rgba(255,255,255,0)",
                shadow:          false,
                useHTML:         true,
                pointFormat:     "{series.name}: <b>{point.percentage:.1f}%</b>",
                formatter:       function()
                                 {
                                     let d  = new Date(this.x);
                                     let D  = d.getDate();
                                     let M  = d.getMonth() + 1;
                                     let h  = d.getHours();
                                     let m  = d.getMinutes();
                                     let s  = d.getSeconds();
                                     let ms = Math.round(d.getMilliseconds() / 10);
                                     return "<b>Timestamp</b>: " + D + "." + M + " " + h + ":" + m + ":" + s + "." + ms +
                                         "<br><b>" + this.points[0].series.name + "</b>: " + this.y.toFixed(0) + unit_text;
                                 }
            }
        });
    }
}

class LocustResult extends AnalysisTool
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
        this.footer = data[data.length - 1];
        delete data[data.length - 1];
        this.data    = data;
        this.sorted  = this.data;
        this.metrics = {
            "responseTime": "Response Time"
        };
        this.process();
    }

    process()
    {
        for(let metric in this.metrics)
        {
            this.processed[metric] = {};

            let metric_vals     = objValues(this.sorted, true, "timeStamp", metric);
            let min_metric_time = seriesMin(metric_vals, false, true);
            let avg_metric_val  = objAvg(metric_vals, true, false);
            let max_metric_time = seriesMax(metric_vals, false, true);

            this.processed[metric]["min"]      = metric_vals[min_metric_time];
            this.processed[metric]["min_time"] = min_metric_time;
            this.processed[metric]["avg"]      = avg_metric_val;
            this.processed[metric]["max"]      = metric_vals[max_metric_time];
            this.processed[metric]["max_time"] = max_metric_time;
        }
    }

    getMetricTillTime(metric, time, what)
    {
        let data = this.sorted;

        let first  = parseFloat(data[0]["timeStamp"]);
        let last   = first;
        let values = [];
        for(let i = 0; i < data.length - 1; ++i)
        {
            last = parseFloat(data[i][metric]);

            if(parseFloat(data[i]["timeStamp"]) - first > time || i === data.length - 1)
            {
                if(i === data.length - 1)
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
                    }
                    else if(what === "avg")
                    {
                        return objAvg(values, false, false);
                    }
                    else if(what === "max")
                    {
                        return objMax(values, false, false);
                    }
                }
            }
            values.push(parseFloat(data[i][metric]));
        }
        return Math.round(parseFloat(data[0][metric]) * 100) / 100;
    }

    getMetricByTimeFilter(metric)
    {

    }

    getDiagram(metric)
    {
        let id = (this.metrics[metric] + USER_CONCERN.analysis.tool).toLowerCase().replace(" ", "-");
        el_content.append(chartContainer(this.metrics[metric], id));
        let extremes        = [
            {
                value:     this.processed[metric].min,
                color:     '#00C000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'minimum ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].avg,
                color:     '#FF8000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'average ' + this.metrics[metric], useHTML: true}
            }, {
                value:     this.processed[metric].max,
                color:     '#FF0000',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    100,
                label:     {text: 'maximum ' + this.metrics[metric], useHTML: true}
            }, /Metric\d*/.test(report.constraint) && metric === CONVERSION.metric[USER_CONCERN.query.parameters[report.constraint]] ? {
                value:     USER_CONCERN.query.parameters["Value"],
                color:     '#0080FF',
                dashStyle: 'shortdash',
                width:     2,
                zIndex:    101,
                label:     {text: 'threshold', useHTML: true}
            } : {}
        ];
        let time            = report.target_time === null ? [] : [
            {
                color: '#FCFFC5',
                from:  0,
                to:    parseInt(report.target_time) + parseInt(this.sorted[0]["timeStamp"])
            }
        ];
        this.series[metric] = this.getSeries(metric, "timeStamp", this.footer.service, METRICS[metric].type);

        let min       = parseInt(this.sorted[0]["timeStamp"]);
        let max       = (report.target_time === null) ? undefined : min + parseInt(report.target_time);
        let unit_text = METRICS[metric].unit;
        let unit      = METRICS[metric].unit === "" ? "" : "[" + METRICS[metric].unit + "]";

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
                                     let d  = new Date(this.x);
                                     let D  = d.getDate();
                                     let M  = d.getMonth() + 1;
                                     let h  = d.getHours();
                                     let m  = d.getMinutes();
                                     let s  = d.getSeconds();
                                     let ms = Math.round(d.getMilliseconds() / 10);
                                     return "<b>Timestamp</b>: " + D + "." + M + " " + h + ":" + m + ":" + s + "." + ms +
                                         "<br><b>" + this.points[0].series.name + "</b>: " + this.y.toFixed(0) + unit_text;
                                 }
            }
        });
    }
}

class BenchFlowResult extends AnalysisTool
{
    constructor(data)
    {
        super();
    }

    process()
    {

    }

    getMetricTillTime(metric, time, what)
    {

    }

    getDiagram(metric)
    {

    }
}

function loadUserConcern(json)
{
    USER_CONCERN = JSON.parse(json);
    query.setQuery(USER_CONCERN.query.text);
    query.setQueryBadgeValues();

    el_data_input_label.html("Load a analysis result (" + USER_CONCERN.analysis.tool + ")" +
        '<input id="data_input" type="file" class="d-none" onclick="upload(this.id, loadAnalysisData);">');

    el_content.html("");
    el_sidebar.html("");
}

function loadAnalysisData(format)
{
    el_loader.show();

    ANALYSIS_DATA = format;

    if(format.split("\n")[0].indexOf("service"))
    {
        USER_CONCERN.analysis.tool = "Locust";
    }

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

    /*
     * Show badge pools
     */
    for(let p in DEFAULT_BADGES)
    {
        $("#" + p + "-badge-pool").css("visibility", "hidden").css("display", "none");
    }
    for(let p in DEFAULT_BADGES)
    {
        let pattern = new RegExp(p[0].toLocaleUpperCase() + p.substr(1) + "\d*");
        for(let param in USER_CONCERN.query.parameters)
        {
            if(pattern.exec(param))
            {
                $("#" + p + "-badge-pool").css("visibility", "visible").css("display", "inline-block");
            }
        }
    }

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
