
Template.nav.onRendered(function () {
    $(".button-collapse").sideNav({
        closeOnClick: true
    });

    //
    $(document).on('keydown', null, 'Alt+f1', function () {
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
    },

    showInbox: function () {
        return Session.get("setting.showInbox");
    },

    taskinboxCount: function () {

        var count = taskInboxQueryResults("").count();
        if (count > 9) {
            count = "9-plus";   // see materializecss icons: mdi-image-filter-1 ... mdi-image-filter-9-plus
        }
        return count;
    }

});


Template.nav.events({
    "click #mnuTaskExport": function (evt, tmpl) {
        evt.preventDefault();
        var t2 = Tasks.find().fetch();
        console.log("Tasks:"+JSON.stringify(t2));
    },

    "click #mnuShowInbox": function (evt, tmpl) {
        evt.preventDefault();
        toggleInboxHelper();
    },

    "click #mnuShowCompleted": function (evt, tmpl) {
        evt.preventDefault();
        Session.set('setting.showCompleted', !Session.get('setting.showCompleted'));
    },

    "click #mnuPrivacyMode": function (evt, tmpl) {
        evt.preventDefault();
        togglePrivacyMode();
    },

    "click #mnuSignOut": function (evt, tmpl) {
        evt.preventDefault();
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
