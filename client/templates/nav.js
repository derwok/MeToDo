
Template.nav.onRendered(function () {
    $(".button-collapse").sideNav();
});


Template.nav.helpers({
    //add you helpers here
});

Template.nav.events({
    "click #mnuTaskExport": function () {
        var t2 = Tasks.find().fetch();
        console.log("Tasks:"+JSON.stringify(t2));
    }
});
