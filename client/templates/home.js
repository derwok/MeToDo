Template.home.onCreated (function () {
});

Template.home.onRendered(function(){
});



Template.home.helpers({

    tasks: function (onlyCompletedTasks) {
        var searchcriteria = {};
        var sortcriteria = {};

        if (Session.get("search-query")) {
            var searchtext = Session.get("search-query");
            searchcriteria = searchParseAll(searchtext);
        }
        // sort & search according to the task block we render
        // 1st: unchecked (tobedone) tasks - always
        // 2nd: checked (done) tasks - optional!
        if (onlyCompletedTasks) {
            searchcriteria["checked"] = {$gt: false};       // {$eq: true} => Error: Unrecognized operator: $eq
            sortcriteria = {sort: [["dateLastWrite","desc"]]};
        } else {
            searchcriteria["checked"] = {$ne: true};
            sortcriteria = {sort: [
                                    ["star", "desc"],
                                    ["prio","asc"],
                                    ["dateLastWrite","desc"]]};
        }

        return Tasks.find(searchcriteria, sortcriteria);
    },

    searches: function () {
        return Searches.find({}, {sort: [["dateLastWrite","desc"]], limit: DEFAULT_MAX_SEARCHHISTORY_LENGTH});
    },

    privacyMode: function () {
        return Session.get("privacyMode");
    },

    searchMode: function () {
        return Session.get("search-query");
    },

    showCompleted: function () {
        return Session.get('setting.showCompleted');
    },

    activateDrop: function () {
        Meteor.defer(function () {
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                constrain_width: false, // Does not change width of dropdown to that of the activator
                hover: false, // Activate only on click
                gutter: 0, // Spacing from edge
                belowOrigin: true // Displays dropdown below the button
            });
        });

    }


});



//////////////////////////////////////////////////////////////
Template.home.events({
    "submit .new-task": function (event) {
        // This function is called when the new task form is submitted

        var text = event.target.text.value;
        if (text.substring(0, 1) === "?") { // do not add search strings
            event.target.text.value = "";
            var searchtext = "?"+Session.get("search-query");
            Meteor.call("addSearch", searchtext);       // async server & client (latency compensation)
            return false;
        }

        Meteor.call("addTask", text);       // async server & client (latency compensation)

        // Clear form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
    },

    "keyup input.main-entry": function (event) {
        var text = event.currentTarget.value;
        if (event.keyCode == 27) {   // ESC
            event.currentTarget.value = "";
            if (text.substring(0, 1) === "?") {     // End current search by ESC
                Session.set("search-query", null);
            }
            return;
        }
        if (event.keyCode == 112 && event.altKey) {   // Alt+F1
            togglePrivacyMode();
            return;
        }

        if (text.substring(0, 1) === "?") {
            var search = text.substring(1, text.length);
            Session.set("search-query", search);
        }
    },

    "click #mnuSearchSearch": function (evt, tmpl) {
        console.log("home click #mnuSearchSearch");
        var mainEntry = $('.main-entry');
        if (mainEntry) {
            mainEntry.val('?').focus();
            mainEntry[0].setSelectionRange(4, 4);
        }
        Session.set("privacyMode", false);
    },

    "click #mnuSearchClear": function (evt, tmpl) {
        console.log("home click #mnuSearchClear");
        Session.set("search-query", null);
        Session.set("privacyMode", false);
        var mainEntry = $('.main-entry');
        if (mainEntry) {
            if (mainEntry.val() == '?') {
                mainEntry.val('');
            }
        }
    }

});  // Template.mainbody.events
