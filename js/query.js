/**
 * Handles all inputs from a badge-pool and a query with badge-targets. Should only be used once on a page.
 */
class Query
{
    constructor(element, query)
    {
        this.el = element;

        if(query !== undefined && query !== "" && query !== null)
        {
            this.setQuery(query);
        }
    }

    incomplete()
    {
        for(let p in USER_CONCERN.query.parameters)
        {
            if(USER_CONCERN.query.parameters[p] === "")
            {
                el_content.html(bbad("Query incomplete!"));
                return true;
            }
        }
        return false;
    }

    setQuery(query)
    {
        this.query = query;
        this.el.html(query);

        updateURL();

        this.createBadgeTargets();
        this.createBadges(DEFAULT_BADGES);

        /*
         * Show badge pools
         */
        for(let p in DEFAULT_BADGES)
        {
            $("#" + p + "-badge-pool").css("visibility", "hidden").css("display", "none");
        }
        for(let p in DEFAULT_BADGES)
        {
            let pattern = new RegExp(p[0].toLocaleUpperCase() + p.substr(1) + "\d*");
            for (let param in USER_CONCERN.query.parameters)
            {
                if (pattern.exec(param))
                {
                    $("#" + p + "-badge-pool").css("visibility", "visible").css("display", "inline-block");
                }
            }
        }
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

        while(match)
        {
            let name = match[0].replace('$', '');
            let type = match[0].substr(1).replace(/\d*/g, '').toLowerCase();
            let target = '<div class="d-inline-block ' + type + '-target badge-target" id="' + name + '" ondrop="drop(event);" ondragover="allowDrop(event);"></div>';
            this.el.html(this.el.html().replace(match[0], target));
            match = pattern.exec(this.query);
        }
    }

    /**
     * Fills a badge-pool with elements from the given object. Only badges with the parameter type in the query will appear.
     */
    createBadges(badges)
    {
        for(let type in badges)
        {
            let els = [];
            let badge_type = type;
            let pool = $("#" + badge_type + "-badge-pool").html("");
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
            pool.append(els);
        }
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
    let dropped = ev.target;
    let id = ev.dataTransfer.getData("id");
    let type = ev.dataTransfer.getData("type");
    let draged = document.getElementById(id);
    let drag_duplicate = draged.cloneNode();

    drag_duplicate.id = drag_duplicate.id + "-d";
    drag_duplicate.innerHTML = draged.innerHTML;

    // drop on badge-pool
    if(dropped.id === type + "-badge-pool")
    {
        draged.outerHTML = "";
    }
    // drop on badge target
    else if(dropped.className.split(' ').includes(type + '-target'))
    {
        dropped.appendChild(drag_duplicate);
        USER_CONCERN.query.parameters[dropped.id] = draged.innerText;
    }
    // drop on badge
    else if(dropped.className.split(' ').includes(type + '-badge'))
    {
        let parent = dropped.parentNode;

        // drop on badge in badge-pool
        if(parent.id === type + "-badge-pool")
        {
            let metrics = USER_CONCERN.query.parameters;

            // for(let metric in metrics)
            // {
            //     let value = metrics[metric];
            //     if(value === draged.innerText)
            //     {
            //         USER_CONCERN.query.parameters[metric] = "";
            //     }
            // }
        }
        // drop on badge on badge target
        else if(parent.className.split(' ').includes(type + '-target'))
        {
            parent.innerHTML = "";
            parent.appendChild(drag_duplicate);
            USER_CONCERN.query.parameters[parent.id] = draged.innerText;
        }
    }

    query.el.trigger("queryChanged");

    updateURL();
    $("#redirect").attr("href", "UC_Report.html?concern=" + JSON.stringify(USER_CONCERN));
}