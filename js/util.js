/**
 *
 */
function range(start, end, step)
{
    let step_val   = step;
    let step_index = 0;
    if(isNaN(start))
    {
        let el = start.split(/[:\-]/);
        start  = el[0];
        end    = el[1];
        step   = step || 1;
        return range(parseInt(start), parseInt(end), parseInt(step));
    }
    else if(!isNaN(start) && !isNaN(end))
    {
        if(step.length > 1 && step_index < step.length)
        {
            step_val = step[Math.min(step.length, step_index)];
        }
        let range = [];
        if(end < start)
        {
            for(let i = start; i > end; i -= step_val)
            {
                range.push(i);
                if(step.length > 1 && step_index < step.length)
                {
                    step_val = step[Math.min(step.length, step_index++)];
                }
            }
        }
        else
        {
            for(let i = start; i < end; i += step_val)
            {
                range.push(i);
                if(step.length > 1 && step_index < step.length)
                {
                    step_val = step[Math.min(step.length, step_index++)];
                }
            }
        }
        return range;
    }

    return [];
}

/**
 * Reads the contents from a URL and saves it into a dictionary.
 * @param url
 * @returns Object
 *          The object contains the values of the URL as key value pair.
 */
function parseURL(url)
{
    let parameters = {};
    url            = url.substr(url.indexOf("?") + 1);
    if(url !== "")
    {
        let args = url.split("&");

        for(let i = 0; i < args.length; ++i)
        {
            let pair            = args[i].split("=");
            parameters[pair[0]] = pair[1];
        }
    }
    return parameters;
}

/**
 * Reads a given text and converts it into json format.
 *
 * @param text: The CSV contents as string.
 * @param separator: The separator sign as string (default: ',').
 * @param header: Signs that the CSV contents contain a header line (default: true).
 * @returns Object
 *          A JSON object with indices. Index 0 contains the name of the headers.
 *          Indices 1-n contain the values of each line from the CSV,
 *          as key value pair (header1 : value1, header2 : value2, ...).
 */
function parseCSV(text, separator, header)
{
    separator = separator || ',';
    header    = header || true;

    let lines   = text.split('\n');
    let headers = [];
    let data    = [];

    if(header)
    {
        headers = lines[0].split(separator);
    }
    else
    {
        headers = range(0, lines[0].length, 1);
    }

    data["headers"] = headers;

    for(let i = 0; i < lines.length - 1; ++i)
    {
        if(lines[i + 1] !== "")
        {
            let entry = lines[i + 1].split(separator);
            let vals  = {};
            for(let j = 0; j < headers.length; ++j)
            {
                vals[headers[j]] = entry[j];
            }
            data.push(vals);
        }
    }

    return data;
}

/**
 * Checks if a string contains valid JSON syntax. If the string is parseable, the parsed content is assigned to it.
 * @param str
 * @returns {boolean}
 */
function isJsonString(str)
{
    try
    {
        str = JSON.parse(str);
    }
    catch(e)
    {
        return false;
    }
    return true;
}

// /**
//  * TODO: Bubblesort
//  * Sorts an object by a given key.
//  * @param obj
//  * @param key
//  * @return Object
//  *         The returned object will be sorted by the given key.
//  */
// function objSort(obj, key)
// {
//     let length = objLength(obj);
//     for(let index = 0; index < length; ++index)
//     {
//         if(obj[index].hasOwnProperty(key) && obj[index][key] !== undefined)
//         {
//             for(let search = 0; search < length; ++search)
//             {
//                 if(index !== search)
//                 {
//                     if(obj[search].hasOwnProperty(key) && obj[search][key] !== undefined)
//                     {
//                         if(obj[index][key] < obj[search][key])
//                         {
//                             let temp = obj[index];
//                             obj[index] = obj[search];
//                             obj[search] = temp;
//                         }
//                     }
//                 }
//             }
//         }
//         else
//         {
//             index++;
//         }
//     }
//     return obj;
// }

/**
 * Detects an objects length.
 * @param obj
 * @returns {number}
 */
function objLength(obj)
{
    let length = 0;
    for(let key in obj)
    {
        if(obj.hasOwnProperty(key))
        {
            length++;
        }
    }
    return length;
}

/**
 * Collects all values from a object with nested objects. If only key is chosen, an array is returned.
 * If both, key and value are set an object of pairs is returned.
 * @param obj
 * @param key
 * @param value
 * @param numbers
 */
function objValues(obj, numbers, key, value)
{
    let result = value ? {} : [], obj_len = obj.length;
    for(let i = 0; i < obj_len; ++i)
    {
        if(value !== "" && value !== undefined)
        {
            let k     = numbers ? Math.round(parseFloat(obj[i][key]) * 100) / 100 : obj[i][key];
            let v     = numbers ? Math.round(parseFloat(obj[i][value]) * 100) / 100 : obj[i][value];
            result[k] = v;
        }
        else
        {
            result.push(numbers ? Math.round(parseFloat(obj[i][key]) * 100) / 100 : obj[i][key]);
        }
    }
    return result;
}

/**
 * Returns the objects maximum value. If key is true the maximum key is returned otherwise the maximum value.
 * @param obj
 * @param has_key
 * @param want_key
 */
function objMax(obj, has_key, want_key)
{
    let max  = -Infinity;
    has_key  = has_key || false;
    want_key = want_key || false;
    if(has_key)
    {
        for(let key in obj)
        {
            if(!want_key)
            {
                if(obj[key] > max)
                {
                    max = obj[key];
                }
            }
            else
            {
                if(key > max)
                {
                    max = key;
                }
            }
        }
    }
    else
    {
        max = Math.max.apply(Math, obj);
    }
    return Math.round(max * 100) / 100;
}

/**
 * Returns the average value. If key is true the average key is returned otherwise the average value.
 * @param obj
 * @param has_key
 * @param want_key
 */
function objAvg(obj, has_key, want_key)
{
    let sum  = 0, avg = 0, obj_len = objLength(obj);
    has_key  = has_key || false;
    want_key = want_key || false;

    if(has_key)
    {
        for(let key in obj)
        {
            if(!want_key)
            {
                sum += parseFloat(obj[key]);
            }
            else
            {
                sum += parseFloat(key);
            }
        }
        avg = sum / obj_len;
    }
    else
    {
        avg = obj.reduce(function(a, b)
        {
            return a + b;
        }) / obj_len;
    }
    return Math.round(avg * 100) / 100;
}

function objMedian(obj, has_key, want_key)
{
    let obj_len = objLength(obj);
    has_key     = has_key || false;
    want_key    = want_key || false;
    let values  = [];

    if(has_key)
    {
        for(let key in obj)
        {
            if(!want_key)
            {
                values.push(parseFloat(obj[key]));
            }
            else
            {
                values.push(parseFloat(key));
            }
        }
    }
    else
    {
        values = obj;
    }
    return values[Math.round(values.length / 2)];
}

/**
 * Returns the objects maximum value. If key is true the maximum key is returned otherwise the maximum value.
 * @param obj
 * @param has_key
 * @param want_key
 */
function objMin(obj, has_key, want_key)
{
    let min  = Infinity;
    has_key  = has_key || false;
    want_key = want_key || false;
    if(has_key)
    {
        for(let key in obj)
        {
            if(!want_key)
            {
                if(obj[key] < min)
                {
                    min = obj[key];
                }
            }
            else
            {
                if(key < min)
                {
                    min = key;
                }
            }
        }
    }
    else
    {
        min = Math.min.apply(Math, obj);
    }
    return Math.round(min * 100) / 100;
}

function seriesMin(series, max_key, want_key)
{
    let k    = null;
    let max  = Infinity;
    max_key  = max_key || false;
    want_key = want_key || false;

    for(let key in series)
    {
        if(!max_key)
        {
            if(series[key] < max)
            {
                max = series[key];
                k   = key;
            }
        }
        else
        {
            if(key < max)
            {
                max = key;
                k   = k;
            }
        }
    }

    if(want_key)
    {
        return k;
    }
    else
    {
        return max;
    }
}

function seriesMax(series, max_key, want_key)
{
    let k    = null;
    let max  = -Infinity;
    max_key  = max_key || false;
    want_key = want_key || false;

    for(let key in series)
    {
        if(!max_key)
        {
            if(series[key] > max)
            {
                max = series[key];
                k   = key;
            }
        }
        else
        {
            if(key > max)
            {
                max = key;
                k   = k;
            }
        }
    }

    if(want_key)
    {
        return k;
    }
    else
    {
        return max;
    }
}

function date(val, format)
{
    format = format || "%d.%m %H:%M:%S.%f";
    let d  = new Date(parseInt(val));

    format = format.replace("%d", d.getDate())
                   .replace("%m", d.getMonth() + 1)
                   .replace("%H", d.getHours())
                   .replace("%M", d.getMinutes())
                   .replace("%S", d.getSeconds())
                   .replace("%f", d.getMilliseconds());
    return format;
}

function time(val, format)
{
    format      = format || "%dd %Hh:%Mm:%Ss %fms";
    let seconds = Math.round(val / 1000);
    let minutes = Math.round(seconds / 60);
    let hours   = Math.round(seconds / 3600);
    let days    = Math.round(seconds / 86400);

    format = format.replace("%d", days % 365)
                   .replace("%H", hours % 24)
                   .replace("%M", maxutes % 60)
                   .replace("%S", seconds % 60)
                   .replace("%f", val % 1000);
    return format;
}

/**
 * Collects all checked values from a checkbox group and returns them as array.
 * @param id
 * @return {Array}
 */
function valuesCheckbox(id)
{
    let values = [];

    $("#" + id + " :checked").each(function()
    {
        values.push($(this).val());
    });

    return values;
}

/**
 * Fills a select with the given values.
 */
function fillSelect(id, values)
{
    let select = $("#" + id);

    for(let key in values)
    {
        select.append("<option value='" + values[key] + "'>" + values[key] + "</option>")
    }
}

/**
 * Downloads the content of a elements value to the given filename.
 * @param element
 * @param filename
 */
function download(element, filename)
{
    let text_value = $(element).val();
    let blob       = new Blob([text_value], {type: 'text/plain'});

    let link           = document.createElement("a");
    link.download      = filename;
    link.innerHTML     = "";
    link.href          = window.URL.createObjectURL(blob);
    link.style.display = "none";
    if(window.URL != null)
    {
        link.href = window.URL.createObjectURL(blob);
    }
    document.body.appendChild(link);
    link.click();
}

function upload(element, callback)
{
    let container = $("#" + element);

    container.on("input", function(e)
    {
        let file = e.target.files[0];

        if(file && file.type.match(".*"))
        {
            let r    = new FileReader();
            r.onload = function(ev)
            {
                callback(ev.target.result);
            };
            r.readAsText(file);
        }
    });
}

function chartContainer(title, id)
{
    return "" +
        "<div class='card'>\n" +
        "<div class='card-header' id='" + id + "-heading'>\n" +
        "  <h5 class='mb-0'>\n" +
        "    <button class='btn btn-link' type='button' data-toggle='collapse' data-target='#" + id + "-content' " +
        "       aria-expanded='true' aria-controls='collapseOne' title='Collapse diagram'>\n" +
        "    " + title + "\n" +
        "    </button>\n" +
        "    <span data-toggle='tooltip' data-placement='bottom' title='Show diagram explanation.'>" + refSidebar("?") + "</span>\n" +
        "  </h5>\n" +
        "</div>\n" +
        "<div id='" + id + "-content' class='collapse show' aria-labelledby='" + id + "-heading'>\n" +
        "  <div class='card-body'>\n" +
        "    <div id='" + id + "' class='chart'></div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "</div>";
}

function addSidebarLink(link)
{
    el_sidebar.html('<iframe src="' + link + '" width="100%" height="100%"></iframe>');
}

function addSidebarRef(ref)
{
    el_sidebar.html(REFS[ref]);
}

function linkSidebar(what)
{
    let el = document.createElement("div");
    el.innerHTML += what;
    return className(bneutral("<a onclick='addSidebarLink(\"" + LINKS[what] + "\")'>" + what + "</a>"), "link");
}

function refSidebar(what)
{
    return buneutral("<a onclick='addSidebarRef(\"" + what + "\")'>" + what + "</a>");
}

function sparklineSidebar(metric, name, series)
{
    let content = "" +
        "The following " + linkSidebar('sparkline') + " shows the occurrence of the " + bold(name) + ":<br>" +
        "<div id='sparkline" + metric + name + "' class='sparkline'></div>" +
        "The extracted dates resemble the distribution of the metric 10 percent of the experiment time " +
        "but at least 200ms, around the occurrence.<br>";

    el_sidebar.html("<p>" + content + "</p>");
    Highcharts.SparkLine("sparkline" + metric + name,
        METRICS[metric].type,
        {
            series:  [
                {
                    name: CONVERSION.metric[metric],
                    data: series
                }
            ],
            tooltip: {
                formatter: function()
                           {
                               return '<div style="color:' + this.series.color + '">●</div> <b>' +
                                   this.series.name + "</b>:<br>    " +
                                   this.y;
                           }
            }
        });
}

function sparkline(what, id, series)
{
    return "<a onclick='sparklineSidebar(\"" + what + "\", \"" + id + "\", " + JSON.stringify(series) + ")'>" + id + "</a>";
}

function link(what, to)
{
    return '<a href="#' + to + '">' + underline(what) + '</a>';
}

function id(what, id)
{
    return '<span id="' + id + '">' + what + '</span>';
}

function className(what, id)
{
    return '<span class="' + id + '">' + what + '</span>';
}

function and(text)
{
    return text === "" ? "" : text + " and "
}

function s(value, term, show_value)
{
    let res = "";
    res += (show_value === true) ? value + " " : "";
    res += (value === 1) ? term : term + "s";
    return res;
}

function bold(what)
{
    return "<b>" + what + "</b>";
}

function underline(what)
{
    return "<u style='cursor: pointer'>" + what + "</u>";
}

function bu(what)
{
    return bold(underline(what));
}

function color(what, color)
{
    return "<span style='color: " + color + "'>" + what + "</span>";
}

function bcolor(what, color)
{
    return "<span style='color: " + color + "'>" + bold(what) + "</span>";
}

function good(what)
{
    return color(what, "green");
}

function bgood(what)
{
    return bold(good(what));
}

function ugood(what)
{
    return underline(good(what));
}

function bugood(what)
{
    return underline(bgood(what));
}

function bad(what)
{
    return color(what, "red");
}

function bbad(what)
{
    return bold(bad(what));
}

function ubad(what)
{
    return underline(what, "red");
}

function bubad(what)
{
    return underline(bbad(what));
}

function neutral(what)
{
    return color(what, "dodgerblue");
}

function bneutral(what)
{
    return bold(neutral(what));
}

function uneutral(what)
{
    return underline(neutral(what));
}

function buneutral(what)
{
    return underline(bneutral(what));
}

function updateURL()
{
    if(history.pushState)
    {
        let url      = "?concern=" + JSON.stringify(USER_CONCERN);
        let protocol = window.location.protocol;
        let host     = window.location.host;
        let path     = window.location.pathname.replace(host, "").replace(/^\//, "");
        let new_url  = protocol + "//" + host + "/" + path + url;
        window.history.pushState({path: new_url}, '', new_url);
    }
}
