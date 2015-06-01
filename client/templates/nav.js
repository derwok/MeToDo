
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
        if (! Session.get('setting.showInbox')) {
            Session.set("previous-search-query", Session.get("search-query"));
        }
        Session.set('setting.showInbox', !Session.get('setting.showInbox'));
        if (Session.get('setting.showInbox')) {
            Session.set("search-query", null);
        } else {
            Session.set("search-query", Session.get("previous-search-query"));
        }
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
