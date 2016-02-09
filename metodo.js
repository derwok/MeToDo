
// Meteor.startup(function () {...}

Tasks = new Mongo.Collection("tasks");
TasksArchive = new Mongo.Collection("tasksarchive");
Searches = new Mongo.Collection("searches");

Meteor.startup(function () {
    if (Meteor.isServer) {  // no index support on client side
        Tasks._ensureIndex({owner: 1}); // make publishing a users tasks faster
        TasksArchive._ensureIndex({owner: 1}); // make publishing a users tasks faster

        // call immediately at launch, then regular via Meteor.setTimeout()
        autoarchivefunction();
    }
});

////////// Client Code! /////////
if (Meteor.isClient) {
    Meteor.subscribe("tasks", function() {
    });
    Meteor.subscribe("tasksarchive", function() {
    });
    Meteor.subscribe("searches", function() {
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Session.set("setting.showCompleted", false);
    Session.set("setting.showInbox", false);
}  // Meteor.isClient


////////// Server Code! /////////
if (Meteor.isServer) {
    Meteor.publish("tasks", function () {
        return Tasks.find({owner: this.userId});
    });
    Meteor.publish("tasksarchive", function () {
        return TasksArchive.find({owner: this.userId});
    });
    Meteor.publish("searches", function () {
        return Searches.find({owner: this.userId});
    });

    // Searches.remove({});
     // *** database/schema migration hook ***
    //var tasks = Tasks.find().forEach(function(task){
    //    console.log("Migrating Task:"+task.text);
    //    // Tasks.update(task._id, {$set: {prio: task.prio * 1}});    // convert prio from string to number
    //    Tasks.update(task._id, {$set: {rank: 1.0}});
    //});
    //tasks = TasksArchive.find().forEach(function(task){
    //    console.log("Migrating Archive Task:"+task.text);
    //    TasksArchive.update(task._id, {$set: {rank: 1.0}});
    //});
}


////////// Client & Server Code! /////////
Meteor.methods({
    addTask: function (text) {
        console.log("Meteor.methods.addTask");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        if (text.length == 0) {
            return;
        }

        var newTask = new Task();
        newTask.orgText = text;
        newTask.save(Meteor.userId(), Meteor.user().username);
    },

    // for bulk insert via JSON import feature
    addRawTaskObject: function (rawTaskObj) {
        console.log("Meteor.methods.addRawTaskObject");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var task = new Task();
        task.cloneFromRawTaskObj(rawTaskObj);
        task.save(Meteor.userId(), Meteor.user().username);
    },

    updateTask: function (id, text) {
        console.log("Meteor.methods.updateTask");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var updateTask = new Task(id);
        updateTask.orgText = text;
        updateTask.save();
    },

    updateTaskNotes: function (id, notestext) {
        console.log("Meteor.methods.updateTaskNotes");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        if (!notestext) {
            notestext = "";
        }

        var notesTask = new Task(id);
        notesTask.notes = notestext;
        notesTask.save();
    },


    updateTaskRepeat: function (id, repeatObj) {
        console.log("Meteor.methods.updateTaskRepeat");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var repeatTask = new Task(id);
        repeatTask.repeat = repeatObj;
        repeatTask.save();
    },


    deleteTask: function (taskId) {
        console.log("Meteor.methods.deleteTask");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tasks.remove(taskId);
    },

    removeAllTasksOfUser: function () {
        console.log("Meteor.methods.removeAllTasks");
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Tasks.remove({owner: Meteor.userId()});
        TasksArchive.remove({owner: Meteor.userId()});
    },

    setChecked: function (taskId, setChecked) {
        console.log("Meteor.methods.setChecked");
        var checkTask = new Task (taskId);
        checkTask.checked = setChecked;
        checkTask.save();
    },

    setStar: function (taskId, setStar) {
        console.log("Meteor.methods.setStar");
        var starTask = new Task (taskId);
        starTask.star = setStar;
        starTask.save();
    },

    addSearch: function (searchtext) {
        console.log("Meteor.methods.addSearch");
        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        searchtext = searchtext.toLowerCase().trim();
        Searches.remove({searchText: {$in: [searchtext]}});
        Searches.insert({
            owner: Meteor.userId(),
            searchText: searchtext,
            dateLastWrite: new Date()
        });

        // clean up
        if(Searches.find().count() > 2 * DEFAULT_MAX_SEARCHHISTORY_LENGTH){
            var allSearches = Searches.find({}, {sort: [["dateLastWrite","desc"]], limit: DEFAULT_MAX_SEARCHHISTORY_LENGTH}).fetch();
            var searchIDs = [];
            for (var i = 0; i < allSearches.length; i++) {
                searchIDs.push(allSearches[i]._id);
            }
            Searches.remove({_id: {$nin: searchIDs}});
            console.log("Number of searches after clean up: "+Searches.find().count());
        }
    },

    deleteSearch: function (searchId) {
        console.log("Meteor.methods.deleteSearch");
        Meteor.defer(function () {
            Searches.remove(searchId);
        });
    },

    archiveTask: function (archiveID) {
        aTask = Tasks.findOne({_id: archiveID});
        if (aTask) {
            delete aTask["_id"];
            TasksArchive.insert(aTask);
            Tasks.remove({_id: archiveID});
        }
    }

});
