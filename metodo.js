
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

     // *** database migration hook ***
    var tasks = Tasks.find().forEach(function(task){
        console.log("Task:"+task.text);
        Tasks.update(task._id, {$set: {prio: task.prio * 1}});    // convert prio from string to number
    });
}


////////// Client & Server Code! /////////
Meteor.methods({
    addTask: function (text) {
        console.log("Meteor.methods.addTask");
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
        console.log("Meteor.methods.updateTask");
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
        console.log("Meteor.methods.deleteTask");
        Meteor.defer(function () {
            Tasks.remove(taskId);
        });
    },

    setChecked: function (taskId, setChecked) {
        console.log("Meteor.methods.setChecked");
        Tasks.update(taskId, {$set: {checked: setChecked,
                                    dateLastWrite: new Date()}});
    },

    setStar: function (taskId, setStar) {
        console.log("Meteor.methods.setStar");
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
