Template.home.onCreated (function () {
});

Template.home.onRendered(function(){
});



Template.home.helpers({

    tasks: function () {
        var searchcriteria = {};

        if (Session.get("search-query")) {
            var searchtext = Session.get("search-query");
            var invertedByNOT = false;
            if (searchtext.indexOf("!") == 0) {
                invertedByNOT = true;
                searchtext = searchtext.replace("!", "");
            }

            if (searchtext.indexOf(" ") >= 0) {  // space is interpreted as boolean $and
                var fragmentsString = searchtext.split(/\s+/);
                var fragmentsRegExp = [];
                for (var i=0; i<fragmentsString.length; i++) {
                    if (fragmentsString[i] != "") {
                        var rex = new RegExp(fragmentsString[i],"i");
                        if (invertedByNOT) {
                            fragmentsRegExp.push({orgText: {$not: {$regex: rex}}});
                        } else {
                            fragmentsRegExp.push({orgText: {$regex: rex}});
                        }
                    }
                }
                searchcriteria = {$and: fragmentsRegExp};
            } else {  // simple case - no boolean operator
                var re = new RegExp(searchtext,"i");
                if (invertedByNOT) {
                    searchcriteria = {orgText: {$not: {$regex: re}}};
                } else {
                    searchcriteria = {orgText: {$regex: re}};
                }
            }
        }

        if (! Session.get('setting.showCompleted')) {
            searchcriteria["checked"] = {$ne: true};
        }

        return Tasks.find(searchcriteria, {sort: [
                                                ["checked", "asc"],
                                                ["star", "desc"],
                                                ["prio","asc"],
                                                ["dateLastWrite","desc"]]});
    },

    privacyMode: function () {
        return Session.get("privacyMode");
    },

    searchMode: function () {
        return Session.get("search-query");
    }
});



//////////////////////////////////////////////////////////////
Template.home.events({
    "submit .new-task": function (event) {
        // This function is called when the new task form is submitted
        console.log(event);

        var text = event.target.text.value;
        if (text.substring(0, 1) === "?") { // do not add search strings
            event.target.text.value = "";
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
        if (event.keyCode == 112) {   // F1
            togglePrivacyMode();
            return;
        }

        if (text.substring(0, 1) === "?") {
            var search = text.substring(1, text.length);
            // escape all regexp chars for literal search
            search = search.replace(/[[-[\]{}()*+?.,\\^$|#]/g, "\\$&");    // all '*' to '\*'
            Session.set("search-query", search);
        }
    },

    "click #btnSearchMenu": function () {
        if (Session.get("search-query")) {      // start new search filter
            Session.set("search-query", null);
        } else {                                // end search filter
            $('.main-entry').val('?').focus();
        }
    }
});  // Template.mainbody.events
