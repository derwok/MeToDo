/**
 * Created by wok on 09.02.16.
 */

"use strict";
describe("TaskRepeater", function () {
    it("should repeat in 2 weeks, startDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareDate = new Date(2016, 4, 9, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate.getTime()).toEqual(compareDate.getTime());
    });

    it("should repeat 2 weeks, dueDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareDate = new Date(2016, 4, 9, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.dueDate.getTime()).toEqual(compareDate.getTime());
    });


    it("should repeat 2 weeks, startDate+dueDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 24, 12, 13, 14, 100);
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareStartDate = new Date(2016, 4, 8, 12, 13, 14, 100);
        var compareDueDate = new Date(2016, 4, 9, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate.getTime()).toEqual(compareStartDate.getTime());
        expect(cloneTask.dueDate.getTime()).toEqual(compareDueDate.getTime());
    });


    // -------------------

    it("should repeat 2 weeks, startDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnCompleteDate: true};
        var compareDate = new Date();   // now!
        compareDate.setDate(compareDate.getDate() + 2*7);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate).toBeCloseToDate(compareDate);
    });

    it("should repeat 2 weeks, dueDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnCompleteDate: true};
        var compareDate = new Date();   // now!
        compareDate.setDate(compareDate.getDate() + 2*7);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.dueDate).toBeCloseToDate(compareDate);
    });

    it("should repeat 2 weeks, startDate+dueDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 24, 12, 13, 14, 100);
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "week", everyNumber: 2, repeatOnCompleteDate: true};
        var compareStartDate = new Date();   // now!
        var compareDueDate = new Date();   // now!
        compareDueDate.setDate(compareDueDate.getDate() + 2*7);
        compareStartDate.setDate(compareDueDate.getDate() -1);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate).toBeCloseToDate(compareStartDate);
        expect(cloneTask.dueDate).toBeCloseToDate(compareDueDate);
    });
});