
Template.nav.onRendered(function () {
    $(".button-collapse").sideNav({
        closeOnClick: true
    });

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
    },

    showCompleted: function () {
        return Session.get("setting.showCompleted");
    }


});

Template.nav.events({
    "click #mnuTaskExport": function () {
        event.preventDefault();
        var t2 = Tasks.find().fetch();
        console.log("Tasks:"+JSON.stringify(t2));
    },

    "click #mnuShowCompleted": function () {
        event.preventDefault();
        Session.set('setting.showCompleted', !Session.get('setting.showCompleted'));
    },

    "click #mnuPrivacyMode": function () {
        event.preventDefault();
        togglePrivacyMode();
    },

    "click #mnuSignOut": function () {
        event.preventDefault();
        if (Meteor.userId()) {
            AccountsTemplates.logout();
        }
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
