/**
 * Handles all inputs from a badge-pool and a query with badge-targets. Should only be used once on a page.
 */
class Query
{
    constructor(element, pool, query)
    {
        this.el = element;
        this.pool = pool;

        if(query !== undefined && query !== "")
        {
            this.setQuery(query);
        }
    }

    getQueryValue()
    {

    }

    setQuery(query)
    {
        this.query = query;
        this.el.html(query);

        if(history.pushState)
        {
            let url = "?concern=" + JSON.stringify(USER_CONCERN);
            let new_url = window.location.protocol + "/" + window.location.host + "/" + window.location.pathname + url;
            window.history.pushState({path: new_url}, '', new_url);
        }

        this.createBadgeTargets();
        this.createBadges(DEFAULT_BADGES);
    }

    /**
     * Load parameters from the query and set the values into the badge-targets.
     */
    setQueryBadgeValues()
    {
        let metrics = USER_CONCERN.query.parameters;
        for(let metric in metrics)
        {
            let value = metrics[metric];
            let badge_type = metric.replace(/\d*/g, '').toLowerCase();
            let badge = '<div class="badge ' + badge_type + '-badge" id="' + badge_type + '-' + value +
            '" draggable="true" ondragstart="drag(event);">' + value + '</div>';
            this.el.find("#" + metric).append(badge);
        }
    }

    /**
     * Replaces the parameters with metric targets.
     */
    createBadgeTargets()
    {
        let pattern = /\$([^\d \?,])+\d*/g;
        let match = pattern.exec(this.query);

        while(match != null)
        {
            let name = match[0].replace('$', '');
            let type = match[0].substr(1).replace(/\d*/g, '').toLowerCase();
            let pool = '<div class="d-inline-block ' + type + '-target badge-target" id="' + name + '" ondrop="drop(event);" ondragover="allowDrop(event);"></div>';
            this.el.html(this.el.html().replace(match[0], pool));
            match = pattern.exec(this.query);
        }
    }

    /**
     * Fills a badge-pool with elements from the given object. Only badges with the parameter type in the query will appear.
     */
    createBadges(badges)
    {
        this.pool.html("");
        let els = [];
        for(let type in badges)
        {
            let badge_type = type;
            if(Object.keys(USER_CONCERN.query.parameters).join('#').toLowerCase().replace(/\d/, "").split('#').includes(type))
            {
                for(let value in badges[type])
                {
                    let badge_value = badges[type][value];
                    let badge = '<div class="badge ' + badge_type + '-badge" id="' + badge_type + '-' + badge_value +
                    '" draggable="true" ondragstart="drag(event);">' + badge_value + '</div>';

                    els.push(badge);
                }
            }
        }
        this.pool.append(els);
    }
}

/*
 * Drag and drop events for the query and badges.
 */

function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("id", ev.target.id);
    ev.dataTransfer.setData("type", ev.target.className.split(' ')[1].split('-')[0]);
}

function drop(ev)
{
    ev.preventDefault();
    let target = ev.target;
    let id = ev.dataTransfer.getData("id");
    let type = ev.dataTransfer.getData("type");
    let dropped = document.getElementById(id);
    let badge_pool = $(".badge-pool")[0];
    let duplicate = dropped.cloneNode();
    duplicate.id = duplicate.id + "-d";
    duplicate.innerHTML = dropped.innerHTML;

    // Drop on badge in target area
    if(target.className.split(' ').includes('badge'))
    {
        if(target.className.split(' ').includes(type + "-badge"))
        {
            let parent = target.parentNode;
            target.outerText = "";
            parent.innerHTML = "";
            USER_CONCERN.query.parameters[parent.id] = dropped.innerText;
            parent.appendChild(dropped);
            badge_pool.insertBefore(duplicate, badge_pool.children[0]);
            query.el.trigger("queryChanged");
        }
    }
    // Drop on target area
    else
    {
        if(target.className.split(' ').includes(type + "-target"))
        {
            if(target.children.length !== 0)
            {
                badge_pool.append(target.children[0]);
                target.innerHTML = "";
            }
            USER_CONCERN.query.parameters[target.id] = dropped.innerText;
            target.appendChild(dropped);
            badge_pool.insertBefore(duplicate, badge_pool.children[0]);
            query.el.trigger("queryChanged");
        }
    }

    if(history.pushState)
    {
        let url = "?concern=" + JSON.stringify(USER_CONCERN);
        let new_url = window.location.protocol + "/" + window.location.host + "/" + window.location.pathname + url;
        window.history.pushState({path: new_url}, '', new_url);
    }
    $("#redirect").attr("href", "UC_Report.html?concern=" + JSON.stringify(USER_CONCERN));
}

function dropPool(ev)
{
    ev.preventDefault();
    let target = ev.target;
    let id = ev.dataTransfer.getData("id");

    document.getElementById(id).outerHTML = "";

    let metrics = USER_CONCERN.query.parameters;
    for(let metric in metrics)
    {
        let value = metrics[metric];
        if(value === $("#" + id).html())
        {
            USER_CONCERN.query.parameters[metric] = "";
            query.el.trigger("queryChanged");
        }
    }

    if(history.pushState)
    {
        let url = "?concern=" + JSON.stringify(USER_CONCERN);
        let new_url = window.location.protocol + "/" + window.location.host + "/" + window.location.pathname + url;
        window.history.pushState({path: new_url}, '', new_url);
    }
    $("#redirect").attr("href", "UC_Report.html?concern=" + JSON.stringify(USER_CONCERN));
}
