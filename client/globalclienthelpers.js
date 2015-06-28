

toggleArchiveHelper = function () {
    Session.set('setting.showArchive', !Session.get('setting.showArchive'));
};


toggleInboxHelper = function () {
    if (! Session.get('setting.showInbox')) {
        Session.set("previous-search-query", Session.get("search-query"));
    }
    Session.set('setting.showInbox', !Session.get('setting.showInbox'));
    Session.set('privacyMode', false);  // leave privacy mode
    if (Session.get('setting.showInbox')) {
        Session.set("search-query", null);
    } else {
        Session.set("search-query", Session.get("previous-search-query"));
    }
};

taskInboxQueryResults = function (taskBlockName) {
    var searchcriteria = {$or: [{tags: null},
                                {tags: []},
                                {tags: { $exists : false }} ] };
    var sortcriteria = {sort: [["dateLastWrite","desc"]]};

    if (taskBlockName == "COMPLETED_TASKS") {
        searchcriteria["checked"] = true;
    } else {  // NORMAL
        searchcriteria["checked"] = {$ne: true};
    }

    return Tasks.find(searchcriteria, sortcriteria);
};


taskQueryResults = function (taskBlockName) {
    var searchcriteria = {};
    var sortcriteria = {};

    if (Session.get("search-query")) {
        var searchtext = Session.get("search-query");
        searchcriteria = searchParseAll(searchtext);
    }
    // sort & search according to the task block we render
    // 1st: STARRED tasks - always
    // 2nd: HOT TASKS - always
    // 3rd: NORMAL TASKS - always
    // 4th: checked (done) tasks - optional!
    if (taskBlockName == "COMPLETED_TASKS") {
        searchcriteria["checked"] = true;
        sortcriteria = {sort: [["dateLastWrite","desc"]]};
    } else {  // STARRED, HOT & NORMAL
        searchcriteria["checked"] = {$ne: true};

        var hotDateZone = new Date();  // To find tasks that are due the next NN days
        hotDateZone.setDate(hotDateZone.getDate() + DEFAULT_HOT_ZONE_IN_DAYS);

        if (taskBlockName == "STARRED_TASKS") {  // star always above everything!
            searchcriteria["star"] = true;
        }

        if (taskBlockName == "HOT_TASKS") {
            searchcriteria["star"] = false;     // no stars below STARRED block
            searchcriteria = {$and: [searchcriteria,
                {$and: [{dueDate: {$exists : true } },     // find hot tasks
                    {dueDate: {$ne: null} },
                    {dueDate: {$lte: hotDateZone} }
                ]
                }]
            };
        }

        if (taskBlockName == "NORMAL_TASKS") {
            searchcriteria["star"] = false;     // no stars below STARRED block
            searchcriteria = {$and: [searchcriteria,
                {$or: [{dueDate: {$exists : false } },  // skip hot tasks
                    {dueDate: null },
                    {dueDate: {$gt: hotDateZone} }
                ]
                }]
            };
        }


        // Unless we want to "Show All"
        if (! Session.get('setting.showCompleted')) {
            // Hide tasks with future start date.
            // So, we only want to see tasks with either
            // * non existing startDate attribute or
            // * startDate == null
            // * a startDate in the past
            searchcriteria = {$and: [searchcriteria,
                {$or: [{startDate: {$exists : false} },
                    {startDate: null },
                    {startDate: {$lte: new Date()}}
                ]
                }]
            };
        }

        sortcriteria = {sort: [
            ["prio","asc"],
            ["dateLastWrite","desc"]]};
    }

    return Tasks.find(searchcriteria, sortcriteria);
};