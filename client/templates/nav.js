
Template.nav.onRendered(function () {
    $(".button-collapse").sideNav();
    $(document).on('keydown', null, 'f1', function () {
        togglePrivacyMode();
    });
});


Template.nav.helpers({
    userID: function () {
        return Meteor.userId();
    },

    privacyMode: function () {
        return Session.get("privacyMode");
    }
});

Template.nav.events({
    "click #mnuTaskExport": function () {
        var t2 = Tasks.find().fetch();
        console.log("Tasks:"+JSON.stringify(t2));
    },

    "click #mnuPrivacyMode": function () {
        togglePrivacyMode();
    }
});

togglePrivacyMode = function () {
    if (Session.get('privacyMode')) {
        Session.set('privacyMode', false);
    } else {
        Session.set('privacyMode', true);
    }
    console.log("Privacy Mode now: "+Session.get('privacyMode'));
}
