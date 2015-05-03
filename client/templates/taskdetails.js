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

    repeatOnCompleteDate: function () {
        var repO = this.repeat;
        if (!repO || repO.repeatOnCompleteDate) {
            return {checked: "checked"};
        }
        return "";
    },

    repeatOnTaskDate: function () {
        var repO = this.repeat;
        if (repO && repO.repeatOnTaskDate) {
            return {checked: "checked"};
        }
        return "";
    },


    repeatEveryNumber: function () {
        var repO = this.repeat;
        // if no repeat active, then set on every "1"
        if (!repO || !repO.repeat) {
            return "1";
        }
        return repO.everyNumber;
    },

    repeatSelInterval: function (optionText) {
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
 //add your events here
});

Template.taskdetails.onCreated(function() {
    //add your statement here
});

Template.taskdetails.onRendered(function() {
    $(document).ready(function() {
        $('select').material_select();
    });});

Template.taskdetails.onDestroyed(function() {
    //add your statement here
});

