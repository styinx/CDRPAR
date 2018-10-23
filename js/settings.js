/**
 * The USER_CONCERN saves the session related information a user made in the UC selection.
 * The contents of this variable are saved when a user changes it's selection.
 *
 * query : Contains the query information.
 *     text : Contains the query pattern as string.
 *     type : Contains the type of the query.
 *     parameters : Contains the variable values of the query.
 *     format: Template sentence to answer the query.
 * type: Contains the type of the query (Analysis or Report).
 * analysis:
 *     tool: The name of the analysis tool.
 *     expert: Tells if the user is an expert.
 *     meta: Specific information about the analysis tool.
 */
let USER_CONCERN = {
    query:    {
        text:        "",
        type:        "",
        parameters:  {},
        format:      "",
        target:      "",
        contstraint: ""
    },
    type:     "",
    analysis: {
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
 * parameters:
 * format:
 */
let QUERIES = {
    "What was the $Limit $Metric of the system, $Value $Unit after the experiment start?": {
        type:       "loadtest",
        parameters: {"Limit": "", "Metric": "", "Value": "", "Unit": ""},
        target:     "Metric",
        constraint: "Value",
        format:     "The Limit Metric of the system was $1, Value Unit after the experiment start."
    },
    "What was the $Limit $Metric1 of the system when the $Metric2 was $Condition $Value?": {
        type:       "loadtest",
        parameters: {"Limit": "", "Metric1": "", "Metric2": "", "Condition": "", "Value": "",},
        target:     "Metric1",
        constraint: "Metric2",
        format:     "The Limit Metric1 of the service was $1, when the Metric2 was Condition Value."
    }
};

/**
 * BADGES contains the element available to configure a user concern.
 * Each group of badges can only be used on a target of the same type ('limit-minimum' -> 'limit-target').
 */
let DEFAULT_BADGES = {
    metric:    ["latency", "number of users", "connection time", "response time"],
    limit:     ["minimum", "average", "maximum"],
    condition: ["<", "<=", "=", ">=", ">"],
    service:   ["dummy1", "dummy2", "dummy3"],
    unit:      ["milliseconds", "seconds", "minutes", "hours", "days"],
    value:     range(0, 10, 1).concat(range(10, 100, 10)).concat(range(100, 1001, 100))
};

/**
 * TODO unused:
 *      A badge pool should only have badges that make sense to use.
 *      A loadtest shouldn't have the CPU Utilization as metric.
 */
let BADGES = {
    loadtest: {
        metric:    ["latency", "number of users", "connection time"],
        limit:     ["minimum", "average", "maximum"],
        condition: ["<", "<=", "=", ">=", ">"],
        service:   ["dummy1", "dummy2", "dummy3"],
        unit:      ["milliseconds", "seconds", "minutes", "hours", "days"],
        value:     range(0, 10, 1).concat(range(10, 100, 10)).concat(range(100, 1001, 100))
    }
};

/**
 * Default configuration for necessary element that cannot be empty.
 */
let DEFAULT = {
    loadtest_domain:    "http://www.example.com",
    loadtest_path:      "",
    loadtest_load:      "100",
    loadtest_loops:     "0",
    loadtest_duration:  "10",
    loadtest_delay:     "0",
    loadtest_ramp_up:   "0",
    loadtest_ramp_down: "0",
    loadtest_min_wait:  "1000",
    loadtest_max_wait:  "2000"
};

/**
 * LINKS contains is a dictionary, where the key is the identifier and the value the url to the target.
 * Aimed to use for sidebar reference.
 */
let LINKS = {
    "JMeter":   "https://en.wikipedia.org/wiki/Apache_JMeter?printable=yes",
    "Locust":   "https://locust.io/",
    "loadtest": "https://en.wikipedia.org/wiki/Load_testing?printable=yes"
};

let REFS = {
    "": ""
};

/**
 * ANALYSIS_DATA stores a set of analysis data as a string.
 */
let ANALYSIS_DATA = "";

/**
 * UNIT_CONVERSION converts query values to the analysis tool values.
 */
let CONVERSION = {
    limit:     {
        "minimum": "min",
        "average": "avg",
        "maximum": "max",
    },
    condition: {
        "<":  function(a, b)
              {
                  return a < b;
              },
        "<=": function(a, b)
              {
                  return a <= b;
              },
        "=":  function(a, b)
              {
                  return a === b;
              },
        ">=": function(a, b)
              {
                  return a >= b;
              },
        ">":  function(a, b)
              {
                  return a > b;
              }
    },
    metric:    {
        "latency":         "Latency",
        "response time":   "responseTime",
        "number of users": "allThreads",
        "connection time": "Connect"
    },
    unit:      {
        "milliseconds": 1,
        "seconds":      1000,
        "minutes":      60000,
        "hours":        3600000,
        "days":         86400000,
    }
};

/**
 * METRICS hold information about all available metrics.
 */
let METRICS = {
    "Latency":      {
        unit:       "ms",
        definition: "Latency is the amount of time a message takes to traverse a system. " +
                        "In a computer network, it is an expression of how much time it takes for " +
                        "a packet of data to get from one designated point to another. " +
                        "It is measured as the time required for a request to be sent to the server and returned to its sender. " +
                        "Latency depends on the speed of the transmission medium  and the delays " +
                        "in the transmission by devices along the way. " +
                        "A low latency indicates a high network efficiency."
    },
    "Connect":      {
        unit:       "ms",
        definition: "The connection time is the amount of time it takes to establish a connection between a client and the server. " +
                        "If the connection request between client and server was successful, the client can send further requests. " +
                        "If the connection was not successful, no further requests can be send to the server." +
                        "The connection time is part of the latency. "
    },
    "elapsed":      {
        unit:       "ms",
        definition: "The elapsed time is the amount of time it takes to send the first request until the last response is received. " +
                        "This metric does not include the time a client is executing code."
    },
    "bytes":      {
        unit:       "bytes",
        definition: "To perform a request, it is necessary to exchange data between client and server. " +
            "This data consists of header data and meta information, which is needed by the server. " +
            "The amount of exchanged information is measured in bytes."
    },
    "allThreads":   {
        unit:       "",
        definition: "In computer science, the number of concurrent users for a resource in a location, with the " +
                        "location being a computing network or a single computer, refers to the total number of people " +
                        "using the resource within a predefined period of time. The resource can, for example, be a " +
                        "computer program, a file, or the computer as a whole. " +
                        "The capacity of a system can also be measured in terms of " +
                        "maximum concurrent users, at which point system performance begins to degrade noticeably."
    },
    "responseTime": {
        unit:       "ms",
        definition: "TODO"
    }
};

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
                  '      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="$JM_DOMAIN" enabled="true">\n' +
                  '        <stringProp name="ThreadGroup.on_sample_error">stopthread</stringProp>\n' +
                  '        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Schleifen-Controller (Loop Controller)" enabled="true">\n' +
                  '          <boolProp name="LoopController.continue_forever">false</boolProp>\n' +
                  '          <stringProp name="LoopController.loops">$JM_LOOPS</stringProp>\n' +
                  '        </elementProp>\n' +
                  '        <stringProp name="ThreadGroup.num_threads">$JM_LOAD</stringProp>\n' +
                  '        <stringProp name="ThreadGroup.ramp_time">$JM_RAMP_UP</stringProp>\n' +
                  '        <boolProp name="ThreadGroup.scheduler">true</boolProp>\n' +
                  '        <stringProp name="ThreadGroup.duration">$JM_DURATION</stringProp>\n' +
                  '        <stringProp name="ThreadGroup.delay">$JM_DELAY</stringProp>\n' +
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
                  '              <dataType>false</dataType>\n' +
                  '              <encoding>false</encoding>\n' +
                  '              <assertions>false</assertions>\n' +
                  '              <subresults>false</subresults>\n' +
                  '              <responseData>true</responseData>\n' +
                  '              <samplerData>true</samplerData>\n' +
                  '              <xml>false</xml>\n' +
                  '              <fieldNames>true</fieldNames>\n' +
                  '              <responseHeaders>false</responseHeaders>\n' +
                  '              <requestHeaders>false</requestHeaders>\n' +
                  '              <responseDataOnError>false</responseDataOnError>\n' +
                  '              <saveAssertionResultsFailureMessage>false</saveAssertionResultsFailureMessage>\n' +
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

let LOCUST = {
    'simple': '' +
                  'from locust import HttpLocust, TaskSet, task, events, web\n' +
                  'import time\n' +
                  'import csv\n' +
                  '\n' +
                  '\n' +
                  'def index(l):\n' +
                  '    l.client.get("/")\n' +
                  '\n' +
                  '\n' +
                  'class MyTaskSet(TaskSet):\n' +
                  '    tasks = [index]\n' +
                  '\n' +
                  '\n' +
                  'class MyLocust(HttpLocust):\n' +
                  '    host = "$LC_DOMAIN"\n' +
                  '    result_file = "locust_experiment_result.csv"\n' +
                  '    min_wait = $LC_MIN_WAIT\n' +
                  '    max_wait = $LC_MAX_WAIT\n' +
                  '    task_set = MyTaskSet\n' +
                  '    header = ["timeStamp", "service", "type", "success", "responseTime", "bytes"]\n' +
                  '    footer = ["$LC_DOMAIN"]\n' +
                  '    data = []\n' +
                  '    last_entry = 0\n' +
                  '\n' +
                  '    def __init__(self):\n' +
                  '        super(MyLocust, self).__init__()\n' +
                  '        events.request_success += self.save_succ\n' +
                  '        events.request_failure += self.save_fail\n' +
                  '        events.quitting += self.write\n' +
                  '\n' +
                  '    def save_succ(self, request_type, name, response_time, response_length):\n' +
                  '        self.save(request_type, name, response_time, response_length, 1)\n' +
                  '\n' +
                  '    def save_fail(self, request_type, name, response_time):\n' +
                  '        self.save(request_type, name, response_time, 0, 0)\n' +
                  '\n' +
                  '    def save(self, request_type, name, response_time, response_length, success):\n' +
                  '        timestamp = int(round(time.time() * 1000))\n' +
                  '        if timestamp != self.last_entry:\n' +
                  '            self.data.append([timestamp, name, request_type, success, response_time, response_length])\n' +
                  '            self.last_entry = timestamp\n' +
                  '\n' +
                  '    def write(self):\n' +
                  '        with open(self.result_file, \'wb\') as csv_file:\n' +
                  '            csv_file.write(",".join(self.header) + "\\n")\n' +
                  '            for value in self.data:\n' +
                  '                csv_file.write(",".join(str(x) for x in value) + "\\n")\n' +
                  '            csv_file.write(",".join(self.footer) + "\\n")'
};

let SPARKLINE_OPTIONS = {
    chart:         {
        backgroundColor: null,
        borderWidth:     0,
        type:            'scatter',
        margin:          [2, 0, 2, 0],
        width:           120,
        height:          30,
        style:           {overflow: 'visible'},
        skipClone:       true
    },
    title:         {text: ''},
    credits:       {enabled: false},
    xAxis:         {
        crosshair:     true,
        labels:        {enabled: false},
        title:         {text: null},
        startOnTick:   false,
        endOnTick:     false,
        tickPositions: [],
        lineWidth:     0
    },
    yAxis:         {
        endOnTick:      false,
        startOnTick:    false,
        labels:         {enabled: false},
        title:          {text: null},
        lineWidth:      0,
        tickPositioner: function()
                        {
                            let step = (this.dataMax - this.dataMin) / 2;
                            return range(this.dataMin, this.dataMax + 1,
                                step);
                        }
    },
    legend:        {enabled: false},
    navigator:     {enabled: false},
    scrollbar:     {enabled: false},
    rangeSelector: {enabled: false},
    tooltip:       {
        style:      {
            textOverflow: 'ellipsis'
        },
        formatter:  function()
                    {
                        return '<div style="color:' + this.series.color + '">●</div> <b>' + this.series.name + "</b>:<br>    " +
                            this.y;
                    },
        positioner: function(w, h, point)
                    {
                        return {x: point.plotX - w / 2, y: point.plotY - h - 15};
                    }
    },
    plotOptions:   {
        dataGrouping: {enabled: false},
        series:       {
            dataGrouping: {enabled: false},
            animation:    false,
            lineWidth:    1,
            shadow:       false,
            states:       {
                hover: {
                    halo:      {size: 0},
                    lineWidth: 1
                }
            },
            marker:       {
                enabled: false,
                symbol:  'circle',
                radius:  2,
                states:  {
                    hover: {
                        fillColor: null,
                        lineColor: 'rgb(100, 100, 100)',
                        lineWidth: 1
                    }
                }
            }
        }
    }
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
                           let d  = new Date(this.value);
                           let D  = d.getDate();
                           let M  = d.getMonth() + 1;
                           let h  = d.getHours();
                           let m  = d.getMinutes();
                           let s  = d.getSeconds();
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
    rangeSelector: {
        enabled: false
    }
};