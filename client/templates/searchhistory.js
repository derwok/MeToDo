
Template.searchhistory.events({
    "click #mnuSearchHistoryEntry": function (evt, tmpl) {
        var searchtext = this.searchText;
        console.log("search: "+ searchtext);
        Session.set("search-query", searchtext.substr(1)); // remove the leading "?"
        Meteor.call("addSearch", searchtext);              // add to beginning of list

        var mainEntry = $('.main-entry');
        if (mainEntry) {
            if (mainEntry.val() == '?') {
                mainEntry.val('');
            }
            mainEntry.focus();
        }
    }
});
