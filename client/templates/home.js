Template.home.created = function () {
    //add your statement here 
};

Template.home.helpers({

    tasks: function () {
        var searchcriteria = {};
        if (Session.get("hideCompleted")) {
            searchcriteria["checked"] = {$ne: true};
        }

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

        return Tasks.find(searchcriteria, {sort: [
                                                ["checked", "asc"],
                                                ["prio","asc"],
                                                ["dateLastWrite","desc"]]});
    },

    hideCompleted: function () {
        return Session.get("hideCompleted");
    },

    incompleteCount: function () {
        return Tasks.find({checked: {$ne: true}}).count();
    },

    usernameUpperPlusS: function () {
        if (!Meteor.user().username || Meteor.user().username.length < 3) {
            return "";
        }
        else {
            return Meteor.user().username.toUpperCase() + "s ";
        }
    }
});


//////////////////////////////////////////////////////////////
Template.home.rendered = function(){
    var input = this.find('.main-entry');
    if(input){
        input.focus()
    }
};


//////////////////////////////////////////////////////////////
Template.home.events({
    "submit .new-task": function (event) {
        // This function is called when the new task form is submitted
        console.log(event);

        var text = event.target.text.value;
        if (text.substring(0, 1) === "?") { // do not add search strings
            event.target.text.value = "";
            Session.set("search-query", null);
            return false;
        }

        Meteor.call("addTask", text);       // async server & client (latency compensation)

        // Clear form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
    },

    "change #chkHideCompleted": function (event) {
        Session.set("hideCompleted", event.target.checked);
    },

    "keyup input.main-entry": function (event) {
        var text = event.currentTarget.value;
        if (event.keyCode == 27) {   // ESC
            Session.set("search-query", null);
            event.currentTarget.value = "";
            return;
        }
        if (text.substring(0, 1) === "?") {
            var search = text.substring(1, text.length);
            // escape all regexp chars for literal search
            search = search.replace(/[[-[\]{}()*+?.,\\^$|#]/g, "\\$&");    // all '*' to '\*'
            Session.set("search-query", search);
        }
        else {
            Session.set("search-query", null);
        }
    }
});  // Template.mainbody.events
