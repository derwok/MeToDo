/**
 * Created by wok on 09.02.16.
 */

"use strict";
describe("Task", function () {
    it("should be created with text and priority", function () {
        spyOn(Tasks, "insert").and.callFake(function(doc, callback) {
            // simulate async return of id = "1";
            callback(null, "1");
        });

        var task = new Task();
        task.orgText = "My Task #33";

        expect(task.text).toBe("My Task");
        expect(task.prio).toBe(33);
        task.save();

        // id should be defined
        expect(task.id).toEqual("1");
        expect(Tasks.insert).toHaveBeenCalledWith(
            { orgText: 'My Task #33',
                text: 'My Task', prio: 33,
                tags: [ ],
                star: false,
                startDate: undefined,
                dueDate: undefined,
                createdAt: task.createdAt,
                dateLastWrite: task.dateLastWrite }
            , jasmine.any(Function));
    });
});
