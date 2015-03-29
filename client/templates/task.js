Template.task.helpers({
    triggerautofocus: function() {
        Meteor.defer(function () {  // wait for DOM update, then set focus on edit
            var input = $('.edittask');
            if (input) {
                input.focus();
            }
        });
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

    "click #btnDelete": function () {
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
