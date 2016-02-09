/**
 * Created by wok on 09.02.16.
 */


Jasmine.onTest(function () {
    Meteor.startup(function () {
        if (!Meteor.users.findOne({username: 'velocity'})) {
            console.log("Creating velocity user!");
            Accounts.createUser({username: "velocity", password: "velocity"});
        } else {
            console.log("Found velocity user!");
        }
    });
});
