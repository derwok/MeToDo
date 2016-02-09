/**
 * Created by wok on 09.02.16.
 */

describe("metodo feature", function(){
    it("shows a list of tasks", function(done){
        expect(Meteor.userId()).toBeNull();

        Meteor.loginWithPassword({username: "velocity"}, "velocity", function(err){
            expect(err).toBeUndefined();
            expect(Meteor.userId()).not.toBeNull();
            console.log("Hello User:"+Meteor.userId());

            Meteor.logout(function() {
                done();
            });
        });
    });
});
