Template.task.helpers({
    triggerautofocus: function() {
        Meteor.defer(function () {  // wait for DOM update, then set focus on edit
            var input = $('.edittask');
            if (input) {
                input.focus();
                var strLength= input.val().length * 2;
                input[0].setSelectionRange(strLength, strLength);
            }
        });
    } ,

    editing_task: function () {
        return Session.equals("editing_task_with_id", this._id);
    },

    dateLastWriteISO: function () {
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        return (new Date(this.dateLastWrite - tzoffset)).toISOString().slice(0,-5).replace("T", " ");
    },

    startDateDueDateISO: function () {
        var dates = "";
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        if (this.startDate) {
            dates += ">"+(new Date(this.startDate - tzoffset)).toISOString().slice(0,-14);
        }
        if (this.dueDate) {
            if (dates.length > 0) {
                dates += " "
            }
            dates += "<"+(new Date(this.dueDate - tzoffset)).toISOString().slice(0,-14);
        }
        return dates;
    },

    colorClassForDates: function () {
        var colorclass = "";
        var dateNow = new Date();
        if (this.startDate && this.startDate <= dateNow) {
            console.log("ACTIVE: "+this.startDate+" <= " +dateNow);
            colorclass = "dateActive";
        }
        if (this.dueDate && this.dueDate <= dateNow) {
            console.log("HOT: "+this.dueDate+" <= " +dateNow);
            colorclass = "dateHot";
        }
        return colorclass;
    }
});

Template.task.events({
    "click .toggle-checked": function () {
        // Set the checked property to the opposite of its current value
        Meteor.call("setChecked", this._id, !this.checked);  // async server & client (latency compensation)
    },

    "click .toggle-star": function () {
        Meteor.call("setStar", this._id, !this.star);  // async server & client (latency compensation)
    },


    "click #btnDeleteTask": function () {
        Meteor.call("deleteTask", this._id);
    },

    "click .tasktext": function (evt, tmpl) {
        evt.stopPropagation();
        evt.preventDefault();
        if (! this.checked) {
            Session.set("editing_task_with_id", this._id);
        }
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
