

toggleInboxHelper = function () {
    if (! Session.get('setting.showInbox')) {
        Session.set("previous-search-query", Session.get("search-query"));
    }
    Session.set('setting.showInbox', !Session.get('setting.showInbox'));
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
