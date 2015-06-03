

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
