/**
 * Created by wok on 09.02.16.
 */

"use strict";
describe("TaskRepeater", function () {
    it("should repeat in 1 year, startDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 10, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareDate = new Date(2017, 10, 25, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate.getTime()).toEqual(compareDate.getTime());
    });

    it("should repeat 1 year, dueDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.dueDate = new Date(2016, 10, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareDate = new Date(2017, 10, 25, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.dueDate.getTime()).toEqual(compareDate.getTime());
    });


    it("should repeat 1 year, startDate+dueDate, repeatOnTaskDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 10, 24, 12, 13, 14, 100);
        templateTask.dueDate = new Date(2016, 10, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnTaskDate: true, repeatOnCompleteDate: false};
        var compareStartDate = new Date(2017, 10, 24, 12, 13, 14, 100);
        var compareDueDate = new Date(2017, 10, 25, 12, 13, 14, 100);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate.getTime()).toEqual(compareStartDate.getTime());
        expect(cloneTask.dueDate.getTime()).toEqual(compareDueDate.getTime());
    });


    // -------------------

    it("should repeat 1 year, startDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnCompleteDate: true};
        var compareDate = new Date();   // now!
        compareDate.setFullYear(compareDate.getFullYear() + 1);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate).toBeCloseToDate(compareDate);
    });

    it("should repeat 1 year, dueDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnCompleteDate: true};
        var compareDate = new Date();   // now!
        compareDate.setFullYear(compareDate.getFullYear() + 1);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.dueDate).toBeCloseToDate(compareDate);
    });

    it("should repeat 1 year, startDate+dueDate, repeatOnCompleteDate", function () {
        var templateTask = new Task();
        templateTask.startDate = new Date(2016, 3, 24, 12, 13, 14, 100);
        templateTask.dueDate = new Date(2016, 3, 25, 12, 13, 14, 100);
        templateTask.repeat = {repeat: true, everyInterval: "year", everyNumber: 1, repeatOnCompleteDate: true};
        var compareDueDate = new Date();   // now!
        compareDueDate.setFullYear(compareDueDate.getFullYear() + 1);
        var compareStartDate = new Date();
        compareStartDate.setTime(compareDueDate.getTime());
        compareStartDate.setDate(compareDueDate.getDate() -1);

        var taskRepeater = new TaskRepeater(templateTask);
        var cloneTask = taskRepeater.clone;
        expect(cloneTask).not.toBeNull();
        expect(cloneTask.startDate).toBeCloseToDate(compareStartDate);
        expect(cloneTask.dueDate).toBeCloseToDate(compareDueDate);
    });
});