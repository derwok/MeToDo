// simple-todos.js

// Meteor.startup(function () {...}

Tasks = new Mongo.Collection("tasks");

////////// Client Code! /////////
if (Meteor.isClient) {
    Meteor.subscribe("tasks");

    Template.body.helpers({

        // tasks: [
        //       { text: "This is task 1" },
        //       { text: "This is task 2" },
        //       { text: "This is task 3" }
        //     ],

        // tasks: function () {
        //   return Tasks.find({}, {sort: [["createdAt", "desc"]]})
        // },

        tasks: function () {
            if (Session.get("hideCompleted")) {
                // If hide completed is checked, filter tasks
                return Tasks.find({checked: {$ne: true}}, {sort: [["prio","asc"],["createdAt","desc"]]});
            } else {
                // Otherwise, return all of the tasks
                return Tasks.find({}, {sort: [["prio","asc"],["createdAt","desc"]]});
            }
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
    Template.body.events({
        "submit .new-task": function (event) {
            // This function is called when the new task form is submitted
            console.log(event);

            var text = event.target.text.value;
            Meteor.call("addTask", text);       // async server & client (latency compensation)

            // Clear form
            event.target.text.value = "";

            // Prevent default form submit
            return false;
        },

        "change .switch input": function (event) {
            Session.set("hideCompleted", event.target.checked);
        }
        // "change .hide-completed input": function (event) {
        //   Session.set("hideCompleted", event.target.checked);
        // }
    });  // Template.body.events


    //////////////////////////////////////////////////////////////
    Template.task.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Meteor.call("setChecked", this._id, !this.checked);  // async server & client (latency compensation)
        },

        "click .delete": function () {
            Meteor.call("deleteTask", this._id);
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

    deleteTask: function (taskId) {
        Tasks.remove(taskId);
    },

    setChecked: function (taskId, setChecked) {
        Tasks.update(taskId, {$set: {checked: setChecked}});
    }
});

