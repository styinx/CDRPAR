/**
 *
 */
Highcharts.SparkLine = function(container, type, options)
{
    options = options || {};
    options["chart"] = {type : type, renderTo: container};

    options = Highcharts.merge(SPARKLINE_OPTIONS, options);

    return new Highcharts.Chart(container, options);
};