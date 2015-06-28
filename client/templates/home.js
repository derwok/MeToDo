Template.home.onCreated (function () {
});

Template.home.onRendered(function(){
});



Template.home.helpers({

    tasks: function (taskBlockName) {
        return taskQueryResults(taskBlockName);
    },

    taskinbox: function (taskBlockName) {
        return taskInboxQueryResults(taskBlockName);
    },

    taskarchive: function () {
        return TasksArchive.find();
    },

    countVisibleTasks: function () {
        var count = 0;
        if (Session.get("privacyMode"))
            return count;
        if (Session.get('setting.showInbox')) {
            count = taskInboxQueryResults().count();
            if (Session.get('setting.showCompleted')) {
                count += taskInboxQueryResults("COMPLETED_TASKS").count();
            }
        } else {
            count = taskQueryResults("STARRED_TASKS").count();
            count += taskQueryResults("HOT_TASKS").count();
            count += taskQueryResults("NORMAL_TASKS").count();
            if (Session.get('setting.showCompleted')) {
                count += taskQueryResults("COMPLETED_TASKS").count();
            }
        }

        return count;
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

    showInbox: function () {
        return Session.get('setting.showInbox');
    },

    showArchive: function () {
        return Session.get('setting.showArchive');
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

        text = replaceDoubleAtWithCurrentTag(text);
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
            Session.set('setting.showInbox', null);     // leave Inbox mode on search
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
    },

    "click #btnInboxCount": function (evt, tmpl) {
        console.log("home click #btnInboxCount");
        evt.preventDefault();
        toggleInboxHelper();
    }

});  // Template.mainbody.events
