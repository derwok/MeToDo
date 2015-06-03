
Template.searchhistory.events({
    "click #mnuSearchHistoryEntry": function (evt, tmpl) {

        if (evt.shiftKey) {         // Shift+Click deletes search history entry
            evt.stopPropagation();
            evt.preventDefault();
            Meteor.call("deleteSearch", this._id);
        } else {
            var searchtext = this.searchText;
            Session.set('setting.showInbox', null);     // leave Inbox mode on search
            Session.set("search-query", searchtext.substr(1)); // remove the leading "?"
            Meteor.call("addSearch", searchtext);              // add to beginning of list

            var mainEntry = $('.main-entry');
            if (mainEntry) {
                if (mainEntry.val() == '?') {
                    mainEntry.val('');
                }
            }
            Session.set("privacyMode", false);
        }
    }
});
