function saveModel()
{
    /*
     * Set the concern type.
     */
    USER_CONCERN.type = el_type.find(":checked").val();

    /*
     * Set the query.
     */
    USER_CONCERN.query = {};
    USER_CONCERN.query[el_query.val()] = QUERIES[el_query.val()];

    /*
     * Set Parameters and corresponding values.
     */
    let parameters = valuesCheckbox("filter_parameters");

    if(parameters.includes("Limits"))
    {
        USER_CONCERN.parameters["Limits"] = el_limits.val();
    }
    if(parameters.includes("Metrics"))
    {
        USER_CONCERN.parameters["Metrics"] = el_metrics.val();
    }
    if(parameters.includes("Conditions"))
    {
        USER_CONCERN.parameters["Conditions"] = el_conditions_metric.val() + " " +
        el_conditions_limit.val() + " " +
        el_conditions_value.val();
    }

    /*
     * Set the analysis method.
     */
    USER_CONCERN.analysis.tool = el_analysis_method.val();

    /*
     * Set analysis meta data.
     */
    // if(USER_CONCERN.query.type === "loadtest")
    if(1)
    {
        USER_CONCERN.analysis.meta.domain = el_loadtest_domain.val() || DEFAULT.loadtest_domain;
        USER_CONCERN.analysis.meta.load = el_loadtest_load.val() || DEFAULT.loadtest_load;
        USER_CONCERN.analysis.meta.ramp_up = el_loadtest_ramp_up.val() || DEFAULT.loadtest_ramp_up;
        USER_CONCERN.analysis.meta.ramp_down = el_loadtest_ramp_down.val() || DEFAULT.loadtest_ramp_down;
    }

    /*
     * Configure analysis documents
     */
    if(el_analysis_method.val() === "JMeter")
    {
        let text = JMETER["simple"];
        text = text.replace(/\$JM_DOMAIN/g, USER_CONCERN.analysis.meta.domain)
                   .replace(/\$JM_LOAD/g, USER_CONCERN.analysis.meta.load)
                   .replace(/\$JM_RAMP_UP/g, USER_CONCERN.analysis.meta.ramp_up)
                   .replace(/\$JM_RAMP_DOWN/g, USER_CONCERN.analysis.meta.ramp_down);

        el_jmeter_experiment.val(text);
    }

    /*
     * Set the user concern
     */
    el_user_concern.val(JSON.stringify(USER_CONCERN));

    if(history.pushState)
    {
        let url = "?concern=" + JSON.stringify(USER_CONCERN);
        let new_url = window.location.protocol + "/" + window.location.host + "/" + window.location.pathname + url;
        window.history.pushState({path: new_url}, '', new_url);
    }
    $("#redirect").attr("href", "UC_Report.html?concern=" + JSON.stringify(USER_CONCERN));
}

function loadModel()
{
    let url = window.location.href;
    if(url.indexOf('concern=') > -1)
    {
        USER_CONCERN = JSON.parse(decodeURI(url.substr(url.indexOf('concern=') + 8)));
    }

    /*
     * Set the concern type.
     */
    el_type.find("#filter_type_" + USER_CONCERN.type).prop("checked", true);

    /*
     * Set the query.
     */
    el_query.find(":selected").removeAttr("selected");
    el_query.find("option[value='" + Object.keys(USER_CONCERN.query).toString() + "']").prop("selected", "selected");

    /*
     * Set Parameters and corresponding values.
     */
    let parameters = Object.keys(USER_CONCERN.parameters);

    for(let key in parameters)
    {
        el_parameters.find("#filter_parameter_" + parameters[key]).prop("checked", true);
    }

    if(parameters.includes("Limits"))
    {
        el_limits.val(USER_CONCERN.parameters["Limits"]);
    }
    if(parameters.includes("Metrics"))
    {
        USER_CONCERN.parameters["Metrics"] = el_metrics.val();
    }
    if(parameters.includes("Conditions"))
    {
        USER_CONCERN.parameters["Conditions"] = el_conditions_metric.val() + " " +
        el_conditions_limit.val() + " " +
        el_conditions_value.val();
    }

    /*
     * Set the analysis method.
     */
    el_analysis_method.val(USER_CONCERN.analysis.tool);

    /*
     * Set analysis meta data.
     */
    el_loadtest_domain.val(USER_CONCERN.analysis.meta.domain || DEFAULT.loadtest_domain);
    el_loadtest_load.val(USER_CONCERN.analysis.meta.load || DEFAULT.loadtest_load);
    el_loadtest_ramp_up.val(USER_CONCERN.analysis.meta.ramp_up || DEFAULT.loadtest_ramp_up);
    el_loadtest_ramp_down.val(USER_CONCERN.analysis.meta.ramp_down || DEFAULT.loadtest_ramp_down);

    /*
     * Set the user concern.
     */
    el_user_concern.val(JSON.stringify(USER_CONCERN));

    $("#redirect").attr("href", "UC_Report.html?concern=" + JSON.stringify(USER_CONCERN));
}

function updateUI()
{
    let parameters = valuesCheckbox("filter_parameters");
    let query = el_query.val();
    let analysis_method = el_analysis_method.val();

    /*
     * Show query configuration only if at least one parameter is chosen.
     */
    if(parameters.length > 0)
    {
        $("#query-configuration").show();
    }
    else
    {
        $("#query-configuration").hide();
        $("#parameter-selection").hide();
    }

    /*
     * Show parameter selection and analysis method only if a query is chosen.
     */
    if(query !== null)
    {
        $("#parameter-selection").show();
        $("#analysis-method").show();
    }
    else
    {
        $("#parameter-selection").hide();
        $("#analysis-method").hide();
    }

    let parameter_values = ["Limits", "Metrics", "Conditions", "Services", "Timestamps", "Status"];

    /*
     * Show only parameters that were selected in the filter menu.
     */
    for(let key in parameter_values)
    {
        if(parameters.includes(parameter_values[key]))
        {
            $("#tab-" + parameter_values[key]).show();
        }
        else
        {
            $("#tab-" + parameter_values[key]).hide();
        }
    }

    /*
     * Show JMeter configuration only if the analysis method is JMeter.
     */
    if(analysis_method !== null)
    {
        $("#analysis-configuration").show();
        if(analysis_method === "JMeter")
        {
            $("#jmeter-configuration").show();
        }
        else
        {
            $("#jmeter-configuration").hide();
        }
    }
    else
    {
        $("#analysis-configuration").hide();
    }
}