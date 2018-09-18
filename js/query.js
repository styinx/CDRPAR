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

        this.createTargets();
        this.createBadges(BADGES);
    }

    createTargets()
    {
        let pattern = /\$([^\d \?,])+\d*/g;
        let match = pattern.exec(this.query);

        while(match != null)
        {
            let type = match[0].substr(1).replace(/\d*/g, '').toLowerCase();
            let pool = '<div class="d-inline-block ' + type + '-target badge-target" ondrop="drop(event);" ondragover="allowDrop(event);"></div>';
            this.el.html(this.el.html().replace(match[0], pool));
            match = pattern.exec(this.query);
        }
    }

    createBadges(badges)
    {
        this.pool.html("");
        let els = [];
        for(let type in badges)
        {
            let badge_type = type;
            for(let value in badges[type])
            {
                let badge_value = badges[type][value];
                let badge = '<div class="badge ' + badge_type + '-badge" id="' + badge_type + '-' + badge_value +
                '" draggable="true" ondragstart="drag(event);">' + badge_value + '</div>';

                els.push(badge);
            }
        }
        this.pool.append(els);
    }
}
