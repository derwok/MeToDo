
// Meteor.startup(function () {...}

Tasks = new Mongo.Collection("tasks");

////////// Client Code! /////////
if (Meteor.isClient) {
    Meteor.subscribe("tasks", function() {
        //console.log("Schema update");
        //allTasks = Tasks.find({owner: this.userId});
        //console.log("Count: "+allTasks.count());
        //allTasks.forEach(function (task) {
        //    console.log("Updated: "+task.text)
        //    Tasks.update(task._id, {$set: {dateLastWrite: task.createdAt}});
        //});
    });

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
        var result = taskParseAll(text);
        var currentDate = new Date();
        Tasks.insert({
            owner: Meteor.userId(),
            username: Meteor.user().username,

            orgText: orgText,
            text: result.text,
            prio: result.prio,
            tags: result.tags,
            star: result.star,
            createdAt: currentDate,
            dateLastWrite: currentDate
        });
    },

    updateTask: function (id, text) {
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var orgText = text;                 // TODO: Code Duplicate with addTask !!!
        var result = taskParseAll(text);

        Tasks.update(id, {
            owner: Meteor.userId(),
            username: Meteor.user().username,

            orgText: orgText,
            text: result.text,
            prio: result.prio,
            tags: result.tags,
            star: result.star,
            dateLastWrite: new Date()
        });
    },

    deleteTask: function (taskId) {
        Meteor.defer(function () {
            Tasks.remove(taskId);
        });
    },

    setChecked: function (taskId, setChecked) {
        Tasks.update(taskId, {$set: {checked: setChecked,
                                    dateLastWrite: new Date()}});
    },

    setStar: function (taskId, setStar) {
        var task = Tasks.findOne(taskId);
        if (task) {
            var orgText = task.orgText;
            if (setStar) {
                orgText += " **";
            } else {
                orgText = orgText.replace(/\s*\*\*/, "");
            }
        }
        Tasks.update(taskId, {$set: {star: setStar,
            orgText: orgText,
            dateLastWrite: new Date()}});
    }

});
