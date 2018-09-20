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

    }

    experimentDescription()
    {
        if(USER_CONCERN.query.type === "loadtest")
        {
            let ANALYSIS = USER_CONCERN.analysis;
            el_content.append($(document.createElement("div"))
                              .append("<h1>Experiment Result</h1>")
                              .append("<hr><br>")
                              .append("<h3>Configuration</h3>")
                              .append("<hr>")
                              .append("<p>The chosen Analysis tool was " + linkSidebar(ANALYSIS.tool) + "</p>")
                              .append("<p>The experiment was performed on " + bold(ANALYSIS.meta.domain) + "</p>")
                              .append("<p>The " + linkSidebar("loadtest") + " was done with a load of " + bold(ANALYSIS.meta.load) + " users."));

        }
    }

    toolMetrics()
    {
        let analysis_tool;
        let ANALYSIS = USER_CONCERN.analysis;
        if(ANALYSIS.tool === "JMeter")
        {
            analysis_tool = new JMeterResult(DATA);
        }

        for(let key in analysis_tool.metrics)
        {
            analysis_tool.getTopic(key);
        }
    }

    createReport()
    {
        this.experimentDescription();
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
        this.metrics = {"Latency" : "Latency", "Connect" : "Connection Time"};
        this.process();
    }

    process()
    {
        for(let key in this.metrics)
        {
            this.processed[key] = {};

            let metric_vals = objValues(this.data, true, key, "timeStamp");
            let min_metric_val = objMin(metric_vals, true, true);
            let avg_metric_val = objAvg(metric_vals, true, true);
            let max_metric_val = objMax(metric_vals, true, true);

            this.processed[key]["min"] = min_metric_val;
            this.processed[key]["min_time"] = metric_vals[min_metric_val];
            this.processed[key]["avg"] = avg_metric_val;
            this.processed[key]["max"] = max_metric_val;
            this.processed[key]["max_time"] = metric_vals[max_metric_val];
        }
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
        if(metric === "Latency")
        {
            let latency_min = this.processed["Latency"].min;
            let latency_min_time = this.processed["Latency"].min_time;
            let latency_avg = this.processed["Latency"].avg;
            let latency_max = this.processed["Latency"].max;
            let latency_max_time = this.processed["Latency"].max_time;
            el_content.append("<p>The " + bgood("minimum") + " latency was " + bgood(latency_min) + " ms at " + bold(date(latency_min_time)) + ".</p>")
                      .append("<p>The " + bcolor("average", "orange") + " latency was " + bcolor(latency_avg, "orange") + " ms.</p>")
                      .append("<p>The " + bbad("maximum") + " latency was " + bbad(latency_max) + " ms at " + bold(date(latency_max_time)) + ".</p>");

        }
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

        if(metric === "Latency")
        {
            series = this.getSeries(metric, "timeStamp", USER_CONCERN.analysis.meta.domain);
            Highcharts.setOptions(STOCK_OPTIONS);
        }
        else if(metric === "Connect")
        {
            series = this.getSeries("Connect", "timeStamp", USER_CONCERN.analysis.meta.domain);
            Highcharts.setOptions(STOCK_OPTIONS);
        }

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
    query.setQueryValues();

    el_content.html("");
    el_sidebar.html("");
}

function loadAnalysisData(format)
{
    DATA = format;

    el_content.html("");
    el_sidebar.html("");

    report.createReport();
}