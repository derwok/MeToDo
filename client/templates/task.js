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
