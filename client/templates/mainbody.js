Template.mainbody.created = function () {
    //add your statement here 
};

Template.mainbody.helpers({

    tasks: function () {
        var searchcriteria = {};
        if (Session.get("hideCompleted")) {
            searchcriteria["checked"] = {$ne: true};
        }
        if (Session.get("search-query")) {
            var re = new RegExp(Session.get("search-query"),"i");
            searchcriteria["orgText"] = {$regex: re};
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
Template.mainbody.rendered = function(){
    var input = this.find('.main-entry');
    if(input){
        input.focus()
    }
};


//////////////////////////////////////////////////////////////
Template.mainbody.events({
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

    "change .switch input": function (event) {
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
            Session.set("search-query", search);
        }
        else {
            Session.set("search-query", null);
        }
    }
});  // Template.mainbody.events
