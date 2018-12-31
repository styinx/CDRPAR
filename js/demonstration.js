let QUERY = {
    "Extreme values over time": {
        "What was the maximum latency of the system, 5 minutes after the experiment start?": {
            "query":    {
                "text":        "What was the $Limit $Metric of the system, $Value $Unit after the experiment start?",
                "type":        "loadtest",
                "parameters":  {
                    "Limit":  "maximum",
                    "Metric": "latency",
                    "Value":  "5",
                    "Unit":   "seconds"
                }
                ,
                "format":      "The Limit Metric of the system was $1, Value Unit after the experiment start.",
                "target":      "Metric",
                "contstraint": "",
                "constraint":  "Value"
            },
            "type":     "Analysis",
            "analysis": {
                "tool":   "JMeter",
                "expert": false,
                "meta":   {
                    "domain":    "www.example.com",
                    "path":      "",
                    "load":      "100",
                    "loops":     "10",
                    "duration":  "60",
                    "delay":     "0",
                    "ramp_up":   "1",
                    "ramp_down": "0",
                    "min_wait":  "1000",
                    "max_wait":  "2000"
                }
            }
        }
    }
};

let DATA = {
    "JMeter": {
        "www.example.com tested with 100 users":
            "timeStamp,elapsed,label,responseCode,responseMessage,threadName,dataType,success,failureMessage,bytes,sentBytes,grpThreads,allThreads,Latency,IdleTime,Connect\n" +
            "1538228262038,319,HTTP Request,200,OK,www.example.com 1-6,text,true,,1613,116,35,35,319,0,157\n" +
            "1538228262036,337,HTTP Request,200,OK,www.example.com 1-4,text,true,,1613,116,35,35,337,0,167\n" +
            "1538228262035,344,HTTP Request,200,OK,www.example.com 1-2,text,true,,1592,116,35,35,344,0,168\n" +
            "1538228262035,344,HTTP Request,200,OK,www.example.com 1-5,text,true,,1592,116,35,35,344,0,165\n" +
            "1538228262059,326,HTTP Request,200,OK,www.example.com 1-8,text,true,,1597,116,33,33,326,0,142\n" +
            "1538228262049,365,HTTP Request,200,OK,www.example.com 1-7,text,true,,1597,116,35,35,365,0,176\n" +
            "1538228262035,405,HTTP Request,200,OK,www.example.com 1-3,text,true,,1613,116,37,37,405,0,194\n" +
            "1538228262070,395,HTTP Request,200,OK,www.example.com 1-9,text,true,,1592,116,38,38,390,0,161\n" +
            "1538228262090,376,HTTP Request,200,OK,www.example.com 1-11,text,true,,1613,116,38,38,361,0,142\n" +
            "1538228262035,434,HTTP Request,200,OK,www.example.com 1-1,text,true,,1613,116,36,36,415,0,196\n" +
            "1538228262079,392,HTTP Request,200,OK,www.example.com 1-10,text,true,,1597,116,36,36,392,0,152\n" +
            "1538228262102,404,HTTP Request,200,OK,www.example.com 1-12,text,true,,1597,116,38,38,404,0,164\n" +
            "1538228262116,390,HTTP Request,200,OK,www.example.com 1-13,text,true,,1613,116,38,38,390,0,157\n" +
            "1538228262124,437,HTTP Request,200,OK,www.example.com 1-14,text,true,,1592,116,41,41,437,0,165\n" +
            "1538228262134,446,HTTP Request,200,OK,www.example.com 1-15,text,true,,1592,116,42,42,446,0,159\n" +
            "1538228262144,451,HTTP Request,200,OK,www.example.com 1-16,text,true,,1597,116,43,43,451,0,156\n" +
            "1538228262155,462,HTTP Request,200,OK,www.example.com 1-17,text,true,,1613,116,43,43,462,0,160\n" +
            "1538228262169,451,HTTP Request,200,OK,www.example.com 1-18,text,true,,1592,116,42,42,451,0,151\n" +
            "1538228262179,447,HTTP Request,200,OK,www.example.com 1-19,text,true,,1597,116,42,42,447,0,143\n" +
            "1538228262189,461,HTTP Request,200,OK,www.example.com 1-20,text,true,,1597,116,43,43,461,0,150\n" +
            "1538228262200,490,HTTP Request,200,OK,www.example.com 1-21,text,true,,1597,116,46,46,490,0,160\n" +
            "1538228262212,518,HTTP Request,200,OK,www.example.com 1-22,text,true,,1592,116,49,49,518,0,169\n" +
            "1538228262231,549,HTTP Request,200,OK,www.example.com 1-23,text,true,,1613,116,53,53,549,0,220\n" +
            "1538228262249,547,HTTP Request,200,OK,www.example.com 1-25,text,true,,1613,116,53,53,546,0,221\n" +
            "1538228262260,550,HTTP Request,200,OK,www.example.com 1-26,text,true,,1597,116,54,54,550,0,232\n" +
            "1538228262239,574,HTTP Request,200,OK,www.example.com 1-24,text,true,,1613,116,53,53,573,0,254\n" +
            "1538228262270,543,HTTP Request,200,OK,www.example.com 1-27,text,true,,1592,116,52,52,543,0,231\n" +
            "1538228262280,541,HTTP Request,200,OK,www.example.com 1-28,text,true,,1592,116,52,52,541,0,226\n" +
            "1538228262290,552,HTTP Request,200,OK,www.example.com 1-29,text,true,,1597,116,53,53,552,0,270\n" +
            "1538228262311,640,HTTP Request,200,OK,www.example.com 1-31,text,true,,1613,116,62,62,640,0,289\n" +
            "1538228262301,650,HTTP Request,200,OK,www.example.com 1-30,text,true,,1613,116,62,62,650,0,294\n" +
            "1538228262322,649,HTTP Request,200,OK,www.example.com 1-32,text,true,,1597,116,62,62,649,0,308\n" +
            "1538228262332,640,HTTP Request,200,OK,www.example.com 1-33,text,true,,1613,116,61,61,640,0,318\n" +
            "1538228262342,638,HTTP Request,200,OK,www.example.com 1-34,text,true,,1613,116,61,61,638,0,309\n" +
            "1538228262352,634,HTTP Request,200,OK,www.example.com 1-35,text,true,,1592,116,61,61,634,0,320\n" +
            "1538228262378,904,HTTP Request,200,OK,www.example.com 1-37,text,true,,1597,116,65,65,903,0,334\n" +
            "1538228262362,920,HTTP Request,200,OK,www.example.com 1-36,text,true,,1613,116,65,65,920,0,328\n" +
            "1538228262385,915,HTTP Request,200,OK,www.example.com 1-38,text,true,,1592,116,63,63,915,0,345\n" +
            "1538228262398,905,HTTP Request,200,OK,www.example.com 1-39,text,true,,1613,116,62,62,905,0,333\n" +
            "1538228262408,932,HTTP Request,200,OK,www.example.com 1-40,text,true,,1597,116,61,61,932,0,342\n" +
            "1538228262418,965,HTTP Request,200,OK,www.example.com 1-41,text,true,,1613,116,60,60,965,0,338\n" +
            "1538228262430,964,HTTP Request,200,OK,www.example.com 1-42,text,true,,1613,116,59,59,964,0,331\n" +
            "1538228262440,954,HTTP Request,200,OK,www.example.com 1-43,text,true,,1597,116,59,59,954,0,324\n" +
            "1538228262451,960,HTTP Request,200,OK,www.example.com 1-44,text,true,,1613,116,57,57,959,0,329\n" +
            "1538228262481,940,HTTP Request,200,OK,www.example.com 1-47,text,true,,1613,116,56,56,939,0,320\n" +
            "1538228262473,958,HTTP Request,200,OK,www.example.com 1-46,text,true,,1613,116,55,55,958,0,328\n" +
            "1538228262461,970,HTTP Request,200,OK,www.example.com 1-45,text,true,,1613,116,55,55,970,0,350\n" +
            "1538228262492,940,HTTP Request,200,OK,www.example.com 1-48,text,true,,1613,116,53,53,939,0,313\n" +
            "1538228262502,941,HTTP Request,200,OK,www.example.com 1-49,text,true,,1597,116,52,52,939,0,312\n" +
            "1538228262653,930,HTTP Request,200,OK,www.example.com 1-63,text,true,,1592,116,51,51,930,0,327\n" +
            "1538228262663,930,HTTP Request,200,OK,www.example.com 1-64,text,true,,1592,116,50,50,930,0,318\n" +
            "1538228262674,926,HTTP Request,200,OK,www.example.com 1-65,text,true,,1613,116,49,49,926,0,312\n" +
            "1538228262684,987,HTTP Request,200,OK,www.example.com 1-66,text,true,,1597,116,48,48,987,0,595\n" +
            "1538228262704,982,HTTP Request,200,OK,www.example.com 1-68,text,true,,1613,116,47,47,982,0,578\n" +
            "1538228262724,972,HTTP Request,200,OK,www.example.com 1-70,text,true,,1613,116,46,46,972,0,566\n" +
            "1538228262694,1002,HTTP Request,200,OK,www.example.com 1-67,text,true,,1592,116,46,46,1002,0,589\n" +
            "1538228262714,982,HTTP Request,200,OK,www.example.com 1-69,text,true,,1597,116,46,46,982,0,575\n" +
            "1538228262735,970,HTTP Request,200,OK,www.example.com 1-71,text,true,,1613,116,43,43,970,0,566\n" +
            "1538228262746,964,HTTP Request,200,OK,www.example.com 1-72,text,true,,1592,116,42,42,964,0,560\n" +
            "1538228262757,968,HTTP Request,200,OK,www.example.com 1-73,text,true,,1592,116,41,41,968,0,631\n" +
            "1538228262798,935,HTTP Request,200,OK,www.example.com 1-77,text,true,,1597,116,40,40,934,0,622\n" +
            "1538228262788,1073,HTTP Request,200,OK,www.example.com 1-76,text,true,,1597,116,39,39,1073,0,622\n" +
            "1538228262768,1093,HTTP Request,200,OK,www.example.com 1-74,text,true,,1592,116,39,39,1093,0,632\n" +
            "1538228262778,1083,HTTP Request,200,OK,www.example.com 1-75,text,true,,1597,116,39,39,1083,0,623\n" +
            "1538228262809,1056,HTTP Request,200,OK,www.example.com 1-78,text,true,,1597,116,36,36,1056,0,621\n" +
            "1538228262819,1072,HTTP Request,200,OK,www.example.com 1-79,text,true,,1597,116,35,35,1071,0,621\n" +
            "1538228262973,968,HTTP Request,200,OK,www.example.com 1-94,text,true,,1613,116,34,34,968,0,573\n" +
            "1538228262994,960,HTTP Request,200,OK,www.example.com 1-96,text,true,,1597,116,33,33,958,0,591\n" +
            "1538228262984,977,HTTP Request,200,OK,www.example.com 1-95,text,true,,1597,116,32,32,977,0,608\n" +
            "1538228263004,961,HTTP Request,200,OK,www.example.com 1-97,text,true,,1613,116,31,31,961,0,588\n" +
            "1538228263014,956,HTTP Request,200,OK,www.example.com 1-98,text,true,,1592,116,30,30,956,0,586\n" +
            "1538228263024,1046,HTTP Request,200,OK,www.example.com 1-99,text,true,,1613,116,29,29,961,0,595\n" +
            "1538228263035,1036,HTTP Request,200,OK,www.example.com 1-100,text,true,,1613,116,29,29,1036,0,585\n" +
            "1538228262839,1451,HTTP Request,200,OK,www.example.com 1-81,text,true,,1597,116,27,27,1451,0,1272\n" +
            "1538228262624,1697,HTTP Request,200,OK,www.example.com 1-60,text,true,,1613,116,26,26,1697,0,341\n" +
            "1538228262565,1756,HTTP Request,200,OK,www.example.com 1-55,text,true,,1613,116,26,26,1756,0,285\n" +
            "1538228262829,1496,HTTP Request,200,OK,www.example.com 1-80,text,true,,1613,116,24,24,1496,0,1332\n" +
            "1538228262869,1464,HTTP Request,200,OK,www.example.com 1-84,text,true,,1613,116,23,23,1464,0,1301\n" +
            "1538228262859,1485,HTTP Request,200,OK,www.example.com 1-83,text,true,,1613,116,22,22,1485,0,1317\n" +
            "1538228262851,1499,HTTP Request,200,OK,www.example.com 1-82,text,true,,1597,116,21,21,1499,0,1329\n" +
            "1538228262900,1460,HTTP Request,200,OK,www.example.com 1-87,text,true,,1597,116,20,20,1460,0,1282\n" +
            "1538228262611,1749,HTTP Request,200,OK,www.example.com 1-59,text,true,,1592,116,20,20,1749,0,348\n" +
            "1538228262647,1714,HTTP Request,200,OK,www.example.com 1-62,text,true,,1592,116,18,18,1714,0,324\n" +
            "1538228262633,1728,HTTP Request,200,OK,www.example.com 1-61,text,true,,1592,116,18,18,1728,0,337\n" +
            "1538228262555,1817,HTTP Request,200,OK,www.example.com 1-54,text,true,,1613,116,16,16,1817,0,284\n" +
            "1538228262910,1462,HTTP Request,200,OK,www.example.com 1-88,text,true,,1597,116,16,16,1462,0,1273\n" +
            "1538228262591,1781,HTTP Request,200,OK,www.example.com 1-57,text,true,,1592,116,16,16,1781,0,347\n" +
            "1538228262595,1778,HTTP Request,200,OK,www.example.com 1-58,text,true,,1597,116,16,16,1778,0,347\n" +
            "1538228262545,1827,HTTP Request,200,OK,www.example.com 1-53,text,true,,1592,116,16,16,1827,0,294\n" +
            "1538228262524,1856,HTTP Request,200,OK,www.example.com 1-51,text,true,,1613,116,11,11,1856,0,307\n" +
            "1538228262879,1501,HTTP Request,200,OK,www.example.com 1-85,text,true,,1592,116,10,10,1501,0,1305\n" +
            "1538228262513,1878,HTTP Request,200,OK,www.example.com 1-50,text,true,,1613,116,9,9,1878,0,318\n" +
            "1538228262889,1502,HTTP Request,200,OK,www.example.com 1-86,text,true,,1613,116,9,9,1502,0,1295\n" +
            "1538228262575,1817,HTTP Request,200,OK,www.example.com 1-56,text,true,,1592,116,7,7,1817,0,355\n" +
            "1538228262535,1859,HTTP Request,200,OK,www.example.com 1-52,text,true,,1592,116,6,6,1859,0,296\n" +
            "1538228262920,1481,HTTP Request,200,OK,www.example.com 1-89,text,true,,1613,116,5,5,1481,0,1270\n" +
            "1538228262933,1468,HTTP Request,200,OK,www.example.com 1-90,text,true,,1613,116,5,5,1468,0,1257\n" +
            "1538228262944,1487,HTTP Request,200,OK,www.example.com 1-91,text,true,,1613,116,3,3,1487,0,1255\n" +
            "1538228262953,1478,HTTP Request,200,OK,www.example.com 1-92,text,true,,1597,116,3,3,1478,0,1246\n" +
            "1538228262963,1468,HTTP Request,200,OK,www.example.com 1-93,text,true,,1613,116,1,1,1468,0,1232\n" +
            "1538230679203,560,HTTP Request,200,OK,www.example.com 1-8,text,true,,1592,116,59,59,560,0,192\n" +
            "1538230679194,576,HTTP Request,200,OK,www.example.com 1-7,text,true,,1592,116,60,60,576,0,204\n" +
            "1538230679182,581,HTTP Request,200,OK,www.example.com 1-5,text,true,,1613,116,59,59,581,0,213\n" +
            "1538230679182,587,HTTP Request,200,OK,www.example.com 1-3,text,true,,1613,116,60,60,587,0,216\n" +
            "1538230679187,580,HTTP Request,200,OK,www.example.com 1-6,text,true,,1613,116,59,59,580,0,208\n" +
            "1538230679182,626,HTTP Request,200,OK,www.example.com 1-2,text,true,,1613,116,58,58,626,0,224\n" +
            "1538230679182,626,HTTP Request,200,OK,www.example.com 1-1,text,true,,1597,116,57,57,626,0,224\n" +
            "1538230679181,627,HTTP Request,200,OK,www.example.com 1-4,text,true,,1592,116,56,56,627,0,225\n" +
            "1538230679217,619,HTTP Request,200,OK,www.example.com 1-9,text,true,,1613,116,57,57,592,0,189\n" +
            "1538230679227,611,HTTP Request,200,OK,www.example.com 1-10,text,true,,1613,116,57,57,611,0,179\n" +
            "1538230679238,691,HTTP Request,200,OK,www.example.com 1-11,text,true,,1597,116,65,65,691,0,308\n" +
            "1538230679248,682,HTTP Request,200,OK,www.example.com 1-12,text,true,,1613,116,64,64,680,0,299\n" +
            "1538230679279,669,HTTP Request,200,OK,www.example.com 1-15,text,true,,1597,116,64,64,668,0,307\n" +
            "1538230679289,679,HTTP Request,200,OK,www.example.com 1-16,text,true,,1592,116,65,65,679,0,339\n" +
            "1538230679309,668,HTTP Request,200,OK,www.example.com 1-18,text,true,,1613,116,65,65,668,0,337\n" +
            "1538230679299,678,HTTP Request,200,OK,www.example.com 1-17,text,true,,1597,116,65,65,678,0,338\n" +
            "1538230679319,668,HTTP Request,200,OK,www.example.com 1-19,text,true,,1597,116,64,64,668,0,360\n" +
            "1538230679330,668,HTTP Request,200,OK,www.example.com 1-20,text,true,,1592,116,64,64,668,0,357\n" +
            "1538230679403,704,HTTP Request,200,OK,www.example.com 1-26,text,true,,1597,116,74,74,704,0,366\n" +
            "1538230679414,713,HTTP Request,200,OK,www.example.com 1-27,text,true,,1613,116,75,75,713,0,394\n" +
            "1538230679424,704,HTTP Request,200,OK,www.example.com 1-28,text,true,,1613,116,74,74,704,0,384\n" +
            "1538230679446,703,HTTP Request,200,OK,www.example.com 1-30,text,true,,1613,116,75,75,703,0,400\n" +
            "1538230679435,821,HTTP Request,200,OK,www.example.com 1-29,text,true,,1613,116,78,78,730,0,411\n" +
            "1538230679456,801,HTTP Request,200,OK,www.example.com 1-31,text,true,,1592,116,78,78,801,0,390\n" +
            "1538230679467,801,HTTP Request,200,OK,www.example.com 1-32,text,true,,1597,116,76,76,801,0,403\n" +
            "1538230679477,792,HTTP Request,200,OK,www.example.com 1-33,text,true,,1592,116,75,75,792,0,401\n" +
            "1538230679507,781,HTTP Request,200,OK,www.example.com 1-36,text,true,,1592,116,74,74,781,0,390\n" +
            "1538230679497,791,HTTP Request,200,OK,www.example.com 1-35,text,true,,1613,116,74,74,791,0,394\n" +
            "1538230679488,800,HTTP Request,200,OK,www.example.com 1-34,text,true,,1613,116,74,74,800,0,409\n" +
            "1538230679518,829,HTTP Request,200,OK,www.example.com 1-37,text,true,,1592,116,71,71,821,0,398\n" +
            "1538230679528,830,HTTP Request,200,OK,www.example.com 1-38,text,true,,1613,116,70,70,830,0,408\n" +
            "1538230679548,821,HTTP Request,200,OK,www.example.com 1-40,text,true,,1613,116,69,69,821,0,390\n" +
            "1538230679538,831,HTTP Request,200,OK,www.example.com 1-39,text,true,,1597,116,69,69,831,0,400\n" +
            "1538230679558,820,HTTP Request,200,OK,www.example.com 1-41,text,true,,1613,116,67,67,820,0,382\n" +
            "1538230679580,798,HTTP Request,200,OK,www.example.com 1-43,text,true,,1597,116,67,67,798,0,367\n" +
            "1538230679590,797,HTTP Request,200,OK,www.example.com 1-44,text,true,,1592,116,65,65,797,0,367\n" +
            "1538230679600,799,HTTP Request,200,OK,www.example.com 1-45,text,true,,1613,116,64,64,799,0,357\n" +
            "1538230679610,789,HTTP Request,200,OK,www.example.com 1-46,text,true,,1613,116,64,64,789,0,347\n" +
            "1538230679621,779,HTTP Request,200,OK,www.example.com 1-47,text,true,,1613,116,62,62,779,0,347\n" +
            "1538230679662,835,HTTP Request,200,OK,www.example.com 1-50,text,true,,1592,116,61,61,835,0,318\n" +
            "1538230679673,826,HTTP Request,200,OK,www.example.com 1-51,text,true,,1597,116,60,60,825,0,307\n" +
            "1538230679683,825,HTTP Request,200,OK,www.example.com 1-52,text,true,,1613,116,59,59,824,0,304\n" +
            "1538230679693,826,HTTP Request,200,OK,www.example.com 1-53,text,true,,1592,116,58,58,826,0,304\n" +
            "1538230679727,811,HTTP Request,200,OK,www.example.com 1-56,text,true,,1597,116,57,57,811,0,369\n" +
            "1538230679757,782,HTTP Request,200,OK,www.example.com 1-59,text,true,,1592,116,56,56,782,0,350\n" +
            "1538230679783,835,HTTP Request,200,OK,www.example.com 1-61,text,true,,1592,116,55,55,835,0,333\n" +
            "1538230679803,825,HTTP Request,200,OK,www.example.com 1-63,text,true,,1613,116,54,54,825,0,323\n" +
            "1538230679814,816,HTTP Request,200,OK,www.example.com 1-64,text,true,,1592,116,53,53,815,0,317\n" +
            "1538230679837,811,HTTP Request,200,OK,www.example.com 1-66,text,true,,1597,116,52,52,811,0,311\n" +
            "1538230679847,802,HTTP Request,200,OK,www.example.com 1-67,text,true,,1613,116,51,51,802,0,302\n" +
            "1538230679868,830,HTTP Request,200,OK,www.example.com 1-69,text,true,,1597,116,50,50,830,0,388\n" +
            "1538230679858,840,HTTP Request,200,OK,www.example.com 1-68,text,true,,1613,116,50,50,840,0,398\n" +
            "1538230679877,830,HTTP Request,200,OK,www.example.com 1-70,text,true,,1597,116,48,48,830,0,392\n" +
            "1538230679888,831,HTTP Request,200,OK,www.example.com 1-71,text,true,,1592,116,47,47,831,0,389\n" +
            "1538230679898,830,HTTP Request,200,OK,www.example.com 1-72,text,true,,1613,116,46,46,830,0,389\n" +
            "1538230679908,829,HTTP Request,200,OK,www.example.com 1-73,text,true,,1597,116,45,45,829,0,429\n" +
            "1538230679919,828,HTTP Request,200,OK,www.example.com 1-74,text,true,,1597,116,44,44,828,0,419\n" +
            "1538230679929,828,HTTP Request,200,OK,www.example.com 1-75,text,true,,1592,116,43,43,828,0,420\n" +
            "1538230679939,830,HTTP Request,200,OK,www.example.com 1-76,text,true,,1597,116,42,42,830,0,430\n" +
            "1538230679969,868,HTTP Request,200,OK,www.example.com 1-79,text,true,,1597,116,41,41,868,0,430\n" +
            "1538230679979,869,HTTP Request,200,OK,www.example.com 1-80,text,true,,1592,116,40,40,869,0,518\n" +
            "1538230679959,890,HTTP Request,200,OK,www.example.com 1-78,text,true,,1592,116,39,39,890,0,440\n" +
            "1538230679990,869,HTTP Request,200,OK,www.example.com 1-81,text,true,,1613,116,38,38,869,0,517\n" +
            "1538230680000,867,HTTP Request,200,OK,www.example.com 1-82,text,true,,1597,116,37,37,867,0,519\n" +
            "1538230680031,847,HTTP Request,200,OK,www.example.com 1-85,text,true,,1597,116,36,36,847,0,488\n" +
            "1538230680010,869,HTTP Request,200,OK,www.example.com 1-83,text,true,,1597,116,35,35,868,0,517\n" +
            "1538230680020,868,HTTP Request,200,OK,www.example.com 1-84,text,true,,1597,116,34,34,868,0,507\n" +
            "1538230680061,879,HTTP Request,200,OK,www.example.com 1-88,text,true,,1597,116,33,33,879,0,466\n" +
            "1538230680040,908,HTTP Request,200,OK,www.example.com 1-86,text,true,,1592,116,32,32,908,0,487\n" +
            "1538230680051,897,HTTP Request,200,OK,www.example.com 1-87,text,true,,1597,116,32,32,897,0,477\n" +
            "1538230680081,867,HTTP Request,200,OK,www.example.com 1-90,text,true,,1613,116,32,32,867,0,446\n" +
            "1538230680102,857,HTTP Request,200,OK,www.example.com 1-92,text,true,,1592,116,29,29,857,0,435\n" +
            "1538230680091,876,HTTP Request,200,OK,www.example.com 1-91,text,true,,1597,116,28,28,867,0,446\n" +
            "1538230680071,897,HTTP Request,200,OK,www.example.com 1-89,text,true,,1597,116,28,28,897,0,466\n" +
            "1538230680112,875,HTTP Request,200,OK,www.example.com 1-93,text,true,,1613,116,26,26,875,0,496\n" +
            "1538230680122,906,HTTP Request,200,OK,www.example.com 1-94,text,true,,1592,116,25,25,905,0,496\n" +
            "1538230680142,897,HTTP Request,200,OK,www.example.com 1-96,text,true,,1597,116,24,24,897,0,505\n" +
            "1538230680172,876,HTTP Request,200,OK,www.example.com 1-99,text,true,,1613,116,23,23,876,0,486\n" +
            "1538230680163,885,HTTP Request,200,OK,www.example.com 1-98,text,true,,1613,116,22,22,885,0,495\n" +
            "1538230680182,877,HTTP Request,200,OK,www.example.com 1-100,text,true,,1597,116,21,21,876,0,476\n" +
            "1538230680152,907,HTTP Request,200,OK,www.example.com 1-97,text,true,,1613,116,21,21,906,0,506\n" +
            "1538230679568,1911,HTTP Request,200,OK,www.example.com 1-42,text,true,,1597,116,19,19,1911,0,1399\n" +
            "1538230679703,1845,HTTP Request,200,OK,www.example.com 1-54,text,true,,1592,116,18,18,1845,0,1375\n" +
            "1538230679714,1843,HTTP Request,200,OK,www.example.com 1-55,text,true,,1597,116,17,17,1843,0,1414\n" +
            "1538230679269,2300,HTTP Request,200,OK,www.example.com 1-14,text,true,,1592,116,16,16,2300,0,297\n" +
            "1538230679826,1872,HTTP Request,200,OK,www.example.com 1-65,text,true,,1597,116,15,15,1872,0,311\n" +
            "1538230679767,1940,HTTP Request,200,OK,www.example.com 1-60,text,true,,1592,116,14,14,1940,0,342\n" +
            "1538230679390,2388,HTTP Request,200,OK,www.example.com 1-25,text,true,,1592,116,13,13,2209,0,347\n" +
            "1538230680132,1646,HTTP Request,200,OK,www.example.com 1-95,text,true,,1592,116,13,13,1646,0,1428\n" +
            "1538230679949,1881,HTTP Request,200,OK,www.example.com 1-77,text,true,,1592,116,11,11,1881,0,438\n" +
            "1538230679339,2649,HTTP Request,200,OK,www.example.com 1-21,text,true,,1597,116,10,10,2410,0,365\n" +
            "1538230679259,2999,HTTP Request,200,OK,www.example.com 1-13,text,true,,1592,116,9,9,688,0,299\n" +
            "1538230679737,2571,HTTP Request,200,OK,www.example.com 1-57,text,true,,1597,116,8,8,1751,0,1243\n" +
            "1538230679376,3082,HTTP Request,200,OK,www.example.com 1-24,text,true,,1597,116,7,7,720,0,350\n" +
            "1538230679639,2830,HTTP Request,200,OK,www.example.com 1-48,text,true,,1613,116,6,6,2710,0,338\n" +
            "1538230679649,2960,HTTP Request,200,OK,www.example.com 1-49,text,true,,1613,116,5,5,2960,0,328\n" +
            "1538230679362,3276,HTTP Request,200,OK,www.example.com 1-23,text,true,,1592,116,4,4,646,0,346\n" +
            "1538230679349,3329,HTTP Request,200,OK,www.example.com 1-22,text,true,,1592,116,3,3,659,0,357\n" +
            "1538230679793,2945,HTTP Request,200,OK,www.example.com 1-62,text,true,,1613,116,2,2,2686,0,325\n" +
            "1538230679747,4403,HTTP Request,200,OK,www.example.com 1-58,text,true,,1613,116,1,1,792,0,360\n",
    },
    "Locust": {
        "www.example.com tested with 100 users for 2 seconds":
            "timeStamp,service,type,success,responseTime,bytes\n" +
            "1545754057324,/,GET,1,239.98093605,1270\n" +
            "1545754058347,/,GET,1,261.666059494,1270\n" +
            "1545754058347,/,GET,1,261.666059494,1270\n" +
            "1545754058700,/,GET,1,116.149902344,1270\n" +
            "1545754058700,/,GET,1,116.149902344,1270\n" +
            "1545754059324,/,GET,1,235.597133636,1270\n" +
            "1545754059324,/,GET,1,235.597133636,1270\n" +
            "1545754059324,/,GET,1,235.597133636,1270\n" +
            "1545754059647,/,GET,1,113.090991974,1270\n" +
            "1545754059647,/,GET,1,113.090991974,1270\n" +
            "1545754059647,/,GET,1,113.090991974,1270\n" +
            "1545754059831,/,GET,1,112.632989883,1270\n" +
            "1545754059831,/,GET,1,112.632989883,1270\n" +
            "1545754059831,/,GET,1,112.632989883,1270\n" +
            "1545754060350,/,GET,1,261.075973511,1270\n" +
            "1545754060350,/,GET,1,261.075973511,1270\n" +
            "1545754060350,/,GET,1,261.075973511,1270\n" +
            "1545754060350,/,GET,1,261.075973511,1270\n" +
            "1545754060919,/,GET,1,121.570825577,1270\n" +
            "1545754060919,/,GET,1,121.570825577,1270\n" +
            "1545754060919,/,GET,1,121.570825577,1270\n" +
            "1545754060919,/,GET,1,121.570825577,1270\n" +
            "http://www.example.com"
    }
};