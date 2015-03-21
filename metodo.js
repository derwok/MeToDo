
// Meteor.startup(function () {...}

Tasks = new Mongo.Collection("tasks");

////////// Client Code! /////////
if (Meteor.isClient) {
    Meteor.subscribe("tasks");

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

        //console.log("Schema update");
        //allTasks = Tasks.find({owner: this.userId});
        //console.log("Count: "+allTasks.count());
        //allTasks.forEach(function (task) {
        //    console.log("Updated: "+task.text)
        //    Tasks.update(task._id, {$set: {dateLastWrite: task.createdAt}});
        //});

        var orgText = text;
        var result = taskParsePrio(text);
        text = result.text;
        var prio = result.prio;
        result = taskParseTags(text);
        text = result.text;
        var tags = result.tags;
        var currentDate = new Date();
        Tasks.insert({
            text: text,
            orgText: orgText,
            prio: prio,
            tags: tags,
            createdAt: currentDate,
            dateLastWrite: currentDate,
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
            dateLastWrite: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },

    deleteTask: function (taskId) {
        Tasks.remove(taskId);
    },

    setChecked: function (taskId, setChecked) {
        Tasks.update(taskId, {$set: {checked: setChecked,
                                    dateLastWrite: new Date()}});
    }
});
