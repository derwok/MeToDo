Template.exportimport.onRendered(function () {
    Meteor.defer(function () {
        var textarea = $('#id_jsonin');
        if (textarea) {
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
        var tasksjson = $('#id_jsonin').val();
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
            Meteor.call("removeAllTasksOfUser");
            if(Tasks.find().count() === 0) {
                for (var i=0; i<tasksarray.length; i++) {
                    var taskObj = tasksarray[i];

                    // we have to explicitly convert all Date objects  from JSON strings
                    for (var property in taskObj) {
                        if (taskObj.hasOwnProperty(property)) {
                            // e.g., createdAt:"2015-05-03T17:30:29.620Z"
                            if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]+Z$/.test(taskObj[property])) {
                                taskObj[property] = new Date(taskObj[property]);
                            }
                        }
                    }
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


var recursiveIteration = function (object) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            if (typeof object[property] == "object"){
                recursiveIteration(object[property]);
            }else{
                //found a property which is not an object, check for your conditions here
            }
        }
    }
};



