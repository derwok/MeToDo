Template.exportimport.onRendered(function () {
    Meteor.defer(function () {
        var t2 = Tasks.find().fetch();
        console.log("Tasks:"+t2.length);
        var textarea = $('#id_jsoninout');
        if (textarea) {
            textarea.val(JSON.stringify(t2));
            textarea.select();
            textarea.focus();
        }
    });
});

Template.exportimport.helpers({
    //add you helpers here
});

Template.exportimport.events({
    "click #id_btnImport": function () {
        var tasksjson = $('#id_jsoninout').val();
        if (tasksjson.length === 0) {
            console.log("No JSON");
            return;
        }
        var tasksarray = JSON.parse(tasksjson);
        if (tasksarray.length === 0) {
            console.log("No tasks");
            return;
        }

        if (confirm("Do you really want to delete all tasks and import new ones?")) {
            Meteor.call("removeAllTasks");
            if(Tasks.find().count() === 0) {
                for (var i=0; i<tasksarray.length; i++) {
                    var taskObj = tasksarray[i];
                    Meteor.call("insertTaskObject", taskObj);
                }
                alert("Imported "+tasksarray.length+ " tasks: OK");
            } else {
                alert ("Delete all tasks did not succeed.");
            }
        }
        Router.go("/");
    },

    "click #id_btnCancel": function () {
        Router.go("/");
    }


    });
