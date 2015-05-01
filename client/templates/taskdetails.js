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
    }
});

Template.taskdetails.events({
 //add your events here
});

Template.taskdetails.onCreated(function() {
    //add your statement here
});

Template.taskdetails.onRendered(function() {
    //add your statement here
});

Template.taskdetails.onDestroyed(function() {
    //add your statement here
});

