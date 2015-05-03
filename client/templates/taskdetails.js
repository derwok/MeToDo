Template.taskdetails.helpers({
    triggerautofocus: function() {
        Meteor.defer(function () {  // wait for DOM update, then set focus on edit
            var notes = $('#id_edittaskdetails');
            if (notes) {
                notes.focus();
                var strLength= notes.val().length * 2;
                notes[0].setSelectionRange(strLength, strLength);
            }
        });
    },

    checked_repeatOnCompleteDate: function () {
        var repO = this.repeat;
        if (!repO || repO.repeatOnCompleteDate) {
            return {checked: "checked"};
        }
        return "";
    },

    checked_repeatOnTaskDate: function () {
        var repO = this.repeat;
        if (repO && repO.repeatOnTaskDate) {
            return {checked: "checked"};
        }
        return "";
    },


    num_repeatEveryNumber: function () {
        var repO = this.repeat;
        // if no repeat active, then set on every "1"
        if (!repO || !repO.repeat) {
            return "1";
        }
        return repO.everyNumber;
    },

    selected_repeatSelInterval: function (optionText) {
        var repO = this.repeat;
        // if no repeat active, then select "week" as default
        if ((!repO || !repO.repeat) && optionText == "month") {
            return {selected: "selected"};  // converted to HTML attribute: selected="selected"
        }

        if (repO.everyInterval == optionText) {
            return {selected: "selected"};  // converted to HTML attribute: selected="selected"
        }
        return '';
    }
});

Template.taskdetails.events({
    "click #id_chkRepeat": function (evt, tmpl) {
        var chkRepeat = $('#id_chkRepeat')[0];
        var radRepeatOnCompleteDate = $('#id_radOnCompleteDate');
        var radRepeatOnTaskDate = $('#id_radOnTaskDate');
        var numRepeatEveryNumber = $('#id_inputNumber');
        var selRepeatEveryInterval = $('#id_selInterval');

        if (chkRepeat.checked) {
             radRepeatOnCompleteDate[0].checked = true;
             radRepeatOnCompleteDate.removeAttr("disabled");
             radRepeatOnTaskDate.removeAttr("disabled");
             numRepeatEveryNumber.removeAttr("disabled");
             selRepeatEveryInterval.removeAttr("disabled");
        } else {
             radRepeatOnCompleteDate[0].checked = false;
             radRepeatOnCompleteDate.attr("disabled", "disabled");
             radRepeatOnTaskDate.attr("disabled", "disabled");
             numRepeatEveryNumber.attr("disabled", "disabled");
             selRepeatEveryInterval.attr("disabled", "disabled");
        }
        $('select').material_select();
    },

    
    "click #id_btnCloseEditTasktext": function (evt, tmpl) {
        if (Session.get("editing_taskdetails_with_id")) {
            Session.set("editing_taskdetails_with_id", null);
        }
    }
});

Template.taskdetails.onCreated(function() {
    //add your statement here
});

Template.taskdetails.onRendered(function() {
    $('select').material_select();
});

Template.taskdetails.onDestroyed(function() {
    //add your statement here
});

