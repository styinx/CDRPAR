/**
 * The USER_CONCERN saves the session related information a user made in the UC selection.
 * The contents of this variable are saved when a user changes it's selection.
 *
 * query : Contains the query information.
 *     text : Contains the query pattern as string.
 *     type : Contains the type of the query.
 *     parameters : Contains the variable values of the query.
 * type: Contains the type of the query (Analysis or Report).
 * analysis:
 *     tool: The name of the analysis tool.
 *     expert: Tells if the user is an expert.
 *     meta: Specific information about the analysis tool.
 */
let USER_CONCERN = {
    query:      {
        text:       "",
        type:       "",
        parameters: {},
    },
    type:       "",
    analysis:   {
        tool:   "",
        expert: false,
        meta:   {}
    }
};

/**
 * The QUERIES hold the information about the actual user concern,
 * where the key is the query as string and the object children are the meta data.
 *
 * type : type of the analysis
 */
let QUERIES = {
    "What is the $Limit $Metric1 of service $Service when the $Metric2 is $Condition $Value?": {
        type:       "loadtest",
        parameters: {"Limit": "", "Metric1": "", "Service": "", "Metric2": "", "Condition": "", "Value": ""}
    },
    "What is the $Limit $Metric of service $Service at $Value $Unit?":                         {
        type:       "loadtest",
        parameters: {"Limit": "", "Metric": "", "Service": "", "Value": "", "Unit": ""}
    }
};

/**
 * BADGES contains the element available to configure a user concern.
 * Each group of badges can only be used on a target of the same type ('limit-minimum' -> 'limit-target').
 */
let DEFAULT_BADGES = {
    metric:    ["response time", "latency", "number of users"],
    limit:     ["minimum", "average", "maximum"],
    condition: ["<", "<=", "=", ">=", ">"],
    service:   ["dummy1", "dummy2", "dummy3"],
    unit:      ["milliseconds", "seconds", "minutes", "hours", "days"],
    value:     range(0, 11, [1, 1, 1, 2, 3, 2]).concat(range(15, 101, [5, 5, 5, 10, 10, 25, 25]))
                                               .concat(range(200, 1001, [50, 50, 100, 100]))
};

/**
 * TODO unused:
 *      A badge pool should only have badges that make sense to use.
 *      A loadtest shouldn't have the CPU Utilization as metric.
 */
let LOADTEST_BADGES = {

};

/**
 * Default configuration for necessary element that cannot be empty.
 */
let DEFAULT = {
    loadtest_domain:    "www.example.com",
    loadtest_load:      "100",
    loadtest_ramp_up:   "0",
    loadtest_ramp_down: "0"
};

/**
 * LINKS contains is a dictionary, where the key is the identifier and the value the url to the target.
 * Aimed to use for sidebar reference.
 */
let LINKS = {
    "JMeter": "https://en.wikipedia.org/wiki/Apache_JMeter?printable=yes",
    "loadtest": "https://en.wikipedia.org/wiki/Load_testing?printable=yes"
};

let REFS = {

};

/**
 * DATA stores a set of analysis data as a string.
 */
let DATA = {};

/**
 * JMETER holds different configurations for JMeter. Variable inputs are marked with '$JM_' prefix.
 *
 */
let JMETER = {
    "simple": '' +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<jmeterTestPlan version="1.2" properties="4.0" jmeter="4.0 r1823414">\n' +
              '  <hashTree>\n' +
              '    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="Testplan" enabled="true">\n' +
              '      <stringProp name="TestPlan.comments"></stringProp>\n' +
              '      <boolProp name="TestPlan.functional_mode">false</boolProp>\n' +
              '      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>\n' +
              '      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>\n' +
              '      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="Benutzer definierte Variablen" enabled="true">\n' +
              '        <collectionProp name="Arguments.arguments"/>\n' +
              '      </elementProp>\n' +
              '      <stringProp name="TestPlan.user_define_classpath"></stringProp>\n' +
              '    </TestPlan>\n' +
              '    <hashTree>\n' +
              '      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Thread-Gruppe" enabled="true">\n' +
              '        <stringProp name="ThreadGroup.on_sample_error">stopthread</stringProp>\n' +
              '        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Schleifen-Controller (Loop Controller)" enabled="true">\n' +
              '          <boolProp name="LoopController.continue_forever">false</boolProp>\n' +
              '          <stringProp name="LoopController.loops">1</stringProp>\n' +
              '        </elementProp>\n' +
              '        <stringProp name="ThreadGroup.num_threads">$JM_LOAD</stringProp>\n' +
              '        <stringProp name="ThreadGroup.ramp_time">$JM_RAMP_UP</stringProp>\n' +
              '        <boolProp name="ThreadGroup.scheduler">false</boolProp>\n' +
              '        <stringProp name="ThreadGroup.duration"></stringProp>\n' +
              '        <stringProp name="ThreadGroup.delay"></stringProp>\n' +
              '      </ThreadGroup>\n' +
              '      <hashTree>\n' +
              '        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="HTTP Request" enabled="true">\n' +
              '          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" testname="Benutzer definierte Variablen" enabled="true">\n' +
              '            <collectionProp name="Arguments.arguments"/>\n' +
              '          </elementProp>\n' +
              '          <stringProp name="HTTPSampler.domain">$JM_DOMAIN</stringProp>\n' +
              '          <stringProp name="HTTPSampler.port"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.protocol"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.contentEncoding"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.path"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.method">GET</stringProp>\n' +
              '          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>\n' +
              '          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>\n' +
              '          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>\n' +
              '          <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>\n' +
              '          <stringProp name="HTTPSampler.embedded_url_re"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.connect_timeout"></stringProp>\n' +
              '          <stringProp name="HTTPSampler.response_timeout"></stringProp>\n' +
              '        </HTTPSamplerProxy>\n' +
              '        <hashTree/>\n' +
              '        <ResultCollector guiclass="GraphVisualizer" testclass="ResultCollector" testname="Graph Results" enabled="true">\n' +
              '          <boolProp name="ResultCollector.error_logging">false</boolProp>\n' +
              '          <objProp>\n' +
              '            <name>saveConfig</name>\n' +
              '            <value class="SampleSaveConfiguration">\n' +
              '              <time>true</time>\n' +
              '              <latency>true</latency>\n' +
              '              <timestamp>true</timestamp>\n' +
              '              <success>true</success>\n' +
              '              <label>true</label>\n' +
              '              <code>true</code>\n' +
              '              <message>true</message>\n' +
              '              <threadName>true</threadName>\n' +
              '              <dataType>true</dataType>\n' +
              '              <encoding>false</encoding>\n' +
              '              <assertions>true</assertions>\n' +
              '              <subresults>true</subresults>\n' +
              '              <responseData>false</responseData>\n' +
              '              <samplerData>false</samplerData>\n' +
              '              <xml>false</xml>\n' +
              '              <fieldNames>true</fieldNames>\n' +
              '              <responseHeaders>false</responseHeaders>\n' +
              '              <requestHeaders>false</requestHeaders>\n' +
              '              <responseDataOnError>false</responseDataOnError>\n' +
              '              <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>\n' +
              '              <assertionsResultsToSave>0</assertionsResultsToSave>\n' +
              '              <bytes>true</bytes>\n' +
              '              <sentBytes>true</sentBytes>\n' +
              '              <threadCounts>true</threadCounts>\n' +
              '              <idleTime>true</idleTime>\n' +
              '              <connectTime>true</connectTime>\n' +
              '            </value>\n' +
              '          </objProp>\n' +
              '          <stringProp name="filename"></stringProp>\n' +
              '        </ResultCollector>\n' +
              '        <hashTree/>\n' +
              '      </hashTree>\n' +
              '    </hashTree>\n' +
              '  </hashTree>\n' +
              '</jmeterTestPlan>'
};

/**
 * Holds general configuration about HighChart charts.
 */
let STOCK_OPTIONS = {
    chart:         {
        type:    "spline",
        spacing: 0,
        height:  300
    },
    title:         {text: "asd"},
    credits:       {text: ""},
    xAxis:         {
        lineWidth: 1,
        lineColor: "#333",
        labels:    {
            formatter: function()
                       {
                           let d = new Date(this.value);
                           let D = d.getDate();
                           let M = d.getMonth() + 1;
                           let h = d.getHours();
                           let m = d.getMinutes();
                           let s = d.getSeconds();
                           let ms = Math.round(d.getMilliseconds() / 10);
                           return D + "." + M + "<br>" + h + ":" + m + ":" + s + "." + ms;
                       }
        }
    },
    yAxis:         {
        lineWidth: 1,
        lineColor: "#333",
        opposite:  false
    },
    legend:        {enabled: true},
    navigator:     {
        margin: 5,
        height: 25,
        xAxis:  {labels: {enabled: false}},
        yAxis:  {lineWidth: 0}
    },
    scrollbar:     {
        height:                0,
        margin:                0,
        minWidth:              0,
        showFull:              false,
        zIndex:                -10,
        barBackgroundColor:    'transparent',
        barBorderColor:        'transparent',
        barBorderRadius:       0,
        barBorderWidth:        0,
        buttonBackgroundColor: 'transparent',
        buttonArrowColor:      'transparent',
        buttonBorderColor:     'transparent',
        buttonBorderWidth:     0,
        buttonBorderRadius:    0,
        trackBackgroundColor:  'transparent',
        trackBorderColor:      'transparent',
        trackBorderWidth:      0,
        trackBorderRadius:     0,
        riffleColor:           'transparent'
    },
    tooltip:       {
        formatter: function()
                   {
                       let d = new Date(this.x);
                       let D = d.getDate();
                       let M = d.getMonth() + 1;
                       let h = d.getHours();
                       let m = d.getMinutes();
                       let s = d.getSeconds();
                       let ms = Math.round(d.getMilliseconds() / 10);
                       return "<b>Timestamp</b>: " + D + "." + M + " " + h + ":" + m + ":" + s + "." + ms +
                       "<br><b>" + this.points[0].series.name + "</b>: " + this.y + "ms";
                   }
    },
    rangeSelector: {
        enabled: false
    }
};