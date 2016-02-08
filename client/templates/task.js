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

    editing_taskdetails: function () {
        return Session.equals("editing_taskdetails_with_id", this._id);
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
            colorclass = "dateActive";
        }
        var dateHotZone = new Date();
        dateHotZone.setDate(dateHotZone.getDate() + DEFAULT_HOT_ZONE_IN_DAYS);
        if (this.dueDate && this.dueDate <= dateHotZone) {
            colorclass = "dateHot";
        }
        if (this.dueDate && this.dueDate <= dateNow) {
            colorclass = "dateHottest";
        }

        return colorclass;
    },

    dragborder: function () {
        var dragtarget = Session.get("CurrentDragTargetTaskID");
        // console.log("    -   Border?:"+this._id+" == "+dragtarget);
        if (this._id == dragtarget) {
            return "dragborder";
        }
        return "";
    },

    enableDragAndDrop: function () {
        // no drag'n'drop when we show the Inbox
        if (Session.get('setting.showInbox')) {
            return {};
        }

        var dNdAttributes = {
            ondragstart:"Template.task.MT_drag(event)",
            ondragover:"Template.task.MT_dragOver(event)",
            ondragleave:"Template.task.MT_dragLeave(event)",
            ondrop:"Template.task.MT_drop(event)"
        };

        // Tasks are only draggable if...
        if (!this.checked &&     // task is NOT checked
            this._id != Session.get("editing_task_with_id"))    // task is NOT in edit mode
        {
            dNdAttributes.draggable = "true";
        }
        return dNdAttributes;
    }
});

Template.task.events({
    "click .toggle-checked": function (evt, tmpl) {

        // If task has repeat activated, we must clone a time-shifted version
        if (this.repeat && this.repeat.repeat) {
            var clonedTask = Tasks.findOne(this._id);
            if (clonedTask) {
                clonedTask = calcRepeatedDates(clonedTask); // shift startDate / dueDate
                Meteor.call("insertTaskObject", clonedTask);
            }
        } else if (evt.shiftKey) {
            Materialize.toast('Cloned & Defered...', 2000, 'rounded');

        }

        // Set the checked property to the opposite of its current value
        Meteor.call("setChecked", this._id, !this.checked);  // async server & client (latency compensation)
    },

    "click .toggle-star": function () {
        if (! this.checked) {
            Meteor.call("setStar", this._id, !this.star);  // async server & client (latency compensation)
        }
    },

    "click #id_btnCloseEditTasktext": function () {
        if (Session.get("editing_task_with_id")) {
            Session.set("editing_task_with_id", null);
        }
    },

    "click .btnEditDetails": function () {
        if (Session.equals("editing_taskdetails_with_id", this._id)) {
            saveTaskDetails();
            Session.set("editing_taskdetails_with_id", null);   // close this one
        } else {
            Session.set("editing_taskdetails_with_id", this._id);  // open this one
        }
    },

    "click #btnDeleteTask": function () {
        Meteor.call("deleteTask", this._id);
    },

    "click .tasktext": function (evt, tmpl) {
        evt.stopPropagation();
        evt.preventDefault();
        if (Session.get("editing_taskdetails_with_id")) {
            return;
        }

        if (! this.checked) {
            Session.set("editing_task_with_id", this._id);
        }
    },

    "keyup .edittask": function (evt, tmpl) {
        evt.stopPropagation();
        evt.preventDefault();
        if (evt.which === 13) {
            var text = tmpl.find(".edittask").value;
            text = replaceDoubleAtWithCurrentTag(text);
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


var saveTaskDetails = function () {
    var notes = $('#id_edittaskdetails');
    var chkRepeat = $('#id_chkRepeat')[0];
    var radRepeatOnCompleteDate = $('#id_radOnCompleteDate')[0];
    var radRepeatOnTaskDate = $('#id_radOnTaskDate')[0];
    var numRepeatEveryNumber = $('#id_inputNumber');
    var selRepeatEveryInterval = $('#id_selInterval');

    var task = Tasks.findOne(Session.get("editing_taskdetails_with_id"));

    if (notes && task) {
        notestext =  notes.val();
        if (task.notes != notestext) {
            Meteor.call("updateTaskNotes", Session.get("editing_taskdetails_with_id"), notestext);
        }
    }

    var repeatObject = {repeat: false};
    if (chkRepeat.checked) {
        repeatObject['repeat'] = true;
        repeatObject['repeatOnCompleteDate'] = radRepeatOnCompleteDate.checked;
        repeatObject['repeatOnTaskDate'] = radRepeatOnTaskDate.checked;
        repeatObject['everyNumber'] = numRepeatEveryNumber.val() * 1;
        repeatObject['everyInterval'] = selRepeatEveryInterval.val();
    }

    if (JSON.stringify(task.repeat) !== JSON.stringify(repeatObject)) {
        Meteor.call("updateTaskRepeat", Session.get("editing_taskdetails_with_id"), repeatObject);
    }
};
