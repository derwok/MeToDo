// simple-todos.js

// Meteor.startup(function () {...}

Tasks = new Mongo.Collection("tasks");

////////// Client Code! /////////
if (Meteor.isClient) {
    Meteor.subscribe("tasks");

    Template.body.helpers({

        tasks: function () {
            var searchcriteria = {};
            if (Session.get("hideCompleted")) {
                searchcriteria["checked"] = {$ne: true};
            }
           if (Session.get("search-query")) {
               var re = new RegExp(Session.get("search-query"),"i");
               searchcriteria["orgText"] = {$regex: re};
            }

            return Tasks.find(searchcriteria, {sort: [["prio","asc"],["createdAt","desc"]]});
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
    Template.body.rendered = function(){
        var input = this.find('.main-entry');
        if(input){
            input.focus()
        }
    };


    //////////////////////////////////////////////////////////////
    Template.body.events({
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
    });  // Template.body.events


    //////////////////////////////////////////////////////////////
    Template.task.helpers({
        triggerautofocus: function() {
            console.log("triggerautofocus");
            var input = $('.edittask');
            console.log(input);
            if(input){
                input.focus(true);
                console.log(this._id);
            }
        } ,

        editing_task: function () {
            return Session.equals("editing_task_with_id", this._id);
        }
    });

    Template.task.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Meteor.call("setChecked", this._id, !this.checked);  // async server & client (latency compensation)
        },

        "click .delete": function () {
            Meteor.call("deleteTask", this._id);
        },

        "click .tasktext": function (evt, tmpl) {
            evt.stopPropagation();
            evt.preventDefault();
            Session.set("editing_task_with_id", this._id);
            var edit = $('.edittask');
            if (edit) {
                edit.focus();
            };
        },

        "keyup .edittask": function (evt, tmpl) {
            evt.stopPropagation();
            evt.preventDefault();
            if (evt.which === 13) {
                var text = tmpl.find(".edittask").value;
                Meteor.call("updateTask", this._id, text);
                Session.set("editing_task_with_id", null);
                var edit = $('.main-entry');
                if (edit) {
                    edit.focus();
                };
            }
            if (evt.which === 27) {
                Session.set("editing_task_with_id", null);
                var edit = $('.main-entry');
                if (edit) {
                    edit.focus();
                };
            }
        }

    });  // Template.task.events

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

}  // Meteor.isClient


////////// Server Code! /////////
if (Meteor.isServer) {
    Meteor.publish("tasks", function () {
        return Tasks.find({owner: this.userId});
    });
}


////////// Client & Server Code! /////////
Meteor.methods({
    addTask: function (text) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var orgText = text;
        var result = taskParsePrio(text);
        text = result.text;
        var prio = result.prio;
        result = taskParseTags(text);
        text = result.text;
        var tags = result.tags;

        Tasks.insert({
            text: text,
            orgText: orgText,
            prio: prio,
            tags: tags,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    updateTask: function (id, text) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var orgText = text;                 // TODO: Code Duplicate with addTask !!!
        var result = taskParsePrio(text);
        text = result.text;
        var prio = result.prio;
        result = taskParseTags(text);
        text = result.text;
        var tags = result.tags;

        Tasks.update(id, {
            text: text,
            orgText: orgText,
            prio: prio,
            tags: tags,
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    deleteTask: function (taskId) {
        Tasks.remove(taskId);
    },

    setChecked: function (taskId, setChecked) {
        Tasks.update(taskId, {$set: {checked: setChecked}});
    }
});

