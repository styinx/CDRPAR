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
    if(el_query_pattern.val() !== null)
    {
        USER_CONCERN.query.text = el_query_pattern.val();
        USER_CONCERN.query.type = QUERIES[el_query_pattern.val()].type;
        USER_CONCERN.query.parameters = QUERIES[el_query_pattern.val()].parameters;
        query.setQuery(el_query_pattern.val());
    }

    /*
     * Set Parameters and corresponding values.
     */
    // TODO unused, maybe remove this
    // let parameters = valuesCheckbox("filter_parameters");
    //
    // if(parameters.includes("Limits"))
    // {
    //     USER_CONCERN.query.parameters["Limits"] = el_limits.val();
    // }
    // if(parameters.includes("Metrics"))
    // {
    //     USER_CONCERN.query.parameters["Metrics"] = el_metrics.val();
    // }
    // if(parameters.includes("Conditions"))
    // {
    //     USER_CONCERN.query.parameters["Conditions"] = el_conditions_metric.val() + " " +
    //     el_conditions_limit.val() + " " +
    //     el_conditions_value.val();
    // }

    /*
     * Set the analysis method.
     */
    USER_CONCERN.analysis.tool = el_analysis_method.val();

    /*
     * Set analysis meta data.
     */
    if(USER_CONCERN.query.type === "loadtest")
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
    el_query_pattern.find(":selected").removeAttr("selected");
    el_query_pattern.find("option[value='" + USER_CONCERN.query.text + "']").prop("selected", "selected");
    query.setQuery(el_query_pattern.val());
    query.setQueryValues();

    /*
     * Set Parameters and corresponding values.
     */
    // TODO unused, maybe remove
    // let parameters = Object.keys(USER_CONCERN.parameters);
    //
    // for(let key in parameters)
    // {
    //     el_parameters.find("#filter_parameter_" + parameters[key]).prop("checked", true);
    // }
    //
    // if(parameters.includes("Limits"))
    // {
    //     el_limits.val(USER_CONCERN.parameters["Limits"]);
    // }
    // if(parameters.includes("Metrics"))
    // {
    //     USER_CONCERN.parameters["Metrics"] = el_metrics.val();
    // }
    // if(parameters.includes("Conditions"))
    // {
    //     USER_CONCERN.parameters["Conditions"] = el_conditions_metric.val() + " " +
    //     el_conditions_limit.val() + " " +
    //     el_conditions_value.val();
    // }

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
    let query_pattern = el_query_pattern.val();
    let analysis_method = el_analysis_method.val();

    $("#query-configuration").show();

    /*
     * Show parameter selection and analysis method only if a query is chosen.
     */
    if(query_pattern !== null)
    {
        $("#analysis-method").show();
        // if(el_type.val() === "Analysis")
        // {
        //     $("#indicator-3").show();
        // }
        // else
        // {
        //     $("#indicator-3").hide();
        // }
    }
    else
    {
        $("#analysis-method").hide();
        //$("#indicator-3").hide();
    }

    // TODO unused, maybe remove
    // let parameter_values = ["Limits", "Metrics", "Conditions", "Services", "Timestamps", "Status"];
    //
    // /*
    //  * Show only parameters that were selected in the filter menu.
    //  */
    // for(let key in parameter_values)
    // {
    //     if(parameters.includes(parameter_values[key]))
    //     {
    //         $("#tab-" + parameter_values[key]).show();
    //     }
    //     else
    //     {
    //         $("#tab-" + parameter_values[key]).hide();
    //     }
    // }

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