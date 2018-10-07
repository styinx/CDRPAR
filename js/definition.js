function saveModel()
{
    /*
     * Set expert knowledge.
     */
    USER_CONCERN.analysis.expert = el_expert.is(":checked");

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
        USER_CONCERN.query.format = QUERIES[el_query_pattern.val()].format;
        USER_CONCERN.query.target = QUERIES[el_query_pattern.val()].target;
        USER_CONCERN.query.constraint = QUERIES[el_query_pattern.val()].constraint;
        query.setQuery(el_query_pattern.val());

        /*
         * Show badge pools
         */
        for(let p in DEFAULT_BADGES)
        {
            $("#" + p + "-badge-pool").css("display", "inline-block");
        }
    }

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
        USER_CONCERN.analysis.meta.path =  DEFAULT.loadtest_path;
        USER_CONCERN.analysis.meta.load = el_loadtest_load.val() || DEFAULT.loadtest_load;
        USER_CONCERN.analysis.meta.duration = DEFAULT.loadtest_duration;
        USER_CONCERN.analysis.meta.delay = DEFAULT.loadtest_delay;
        USER_CONCERN.analysis.meta.ramp_up = el_loadtest_ramp_up.val() || DEFAULT.loadtest_ramp_up;
        USER_CONCERN.analysis.meta.ramp_down = el_loadtest_ramp_down.val() || DEFAULT.loadtest_ramp_down;
    }

    /*
     * Configure analysis documents
     */
    if(USER_CONCERN.analysis.tool === "JMeter")
    {
        let text = JMETER["simple"];
        text = text.replace(/\$JM_DOMAIN/g, USER_CONCERN.analysis.meta.domain)
                   .replace(/\$JM_PATH/g, USER_CONCERN.analysis.meta.path)
                   .replace(/\$JM_LOAD/g, USER_CONCERN.analysis.meta.load)
                   .replace(/\$JM_DURATION/g, USER_CONCERN.analysis.meta.duration)
                   .replace(/\$JM_DELAY/g, USER_CONCERN.analysis.meta.delay)
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
        let protocol = window.location.protocol;
        let host = window.location.host;
        let path = window.location.pathname.replace(host, "").replace(/^\//, "");
        let new_url = protocol + "//" + host + "/" + path + url;
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
    el_expert.prop("checked", USER_CONCERN.analysis.expert);

    /*
     * Set the concern type.
     */
    el_type.find("#filter_type_" + USER_CONCERN.type).prop("checked", true);

    /*
     * Set the query.
     */
    if(el_query_pattern.val() !== null)
    {
        el_query_pattern.find(":selected").removeAttr("selected");
        el_query_pattern.find("option[value='" + USER_CONCERN.query.text + "']").prop("selected", "selected");
        query.setQuery(el_query_pattern.val());
        query.setQueryBadgeValues();
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
    let indicator_3 = $("#indicator-3");
    let indicator_4 = $("#indicator-4");
    let indicator_5 = $("#indicator-5");

    let analysis_configuration = $("#analysis-configuration");
    let analysis_method = $("#analysis-method");
    let jmeter_configuration = $("#jmeter-configuration");

    $("#query-configuration").show();

    if(USER_CONCERN.analysis.expert === true)
    {
        $(".expert").show();
    }
    else
    {
        $(".expert").hide();
    }

    if(USER_CONCERN.query.text !== "")
    {
        if(USER_CONCERN.type === "Analysis" && USER_CONCERN.analysis.tool !== "")
        {
            indicator_3.show();
            analysis_method.show();
        }
        else
        {
            indicator_3.hide();
            analysis_method.hide();
        }
    }
    else
    {
        indicator_3.hide();
        indicator_4.hide();
        indicator_5.hide();
    }

    if(USER_CONCERN.analysis.tool !== "" && USER_CONCERN.type === "Analysis")
    {
        indicator_4.show();

        analysis_configuration.show();

        if(USER_CONCERN.analysis.tool === "JMeter")
        {
            jmeter_configuration.show();
        }
        else
        {
            jmeter_configuration.hide();
        }
    }
    else
    {
        indicator_4.hide();
        indicator_5.hide();

        analysis_configuration.hide();
    }

    if(USER_CONCERN.analysis.meta !== {})
    {
        indicator_5.show();
    }
    else
    {
        indicator_5.hide();
    }
}