
calcRepeatedDates = function (clonedTask) {

    if (clonedTask.repeat && clonedTask.repeat.repeat) {
        if (clonedTask.repeat.everyInterval == "day") {
            clonedTask = calcRepeatedDays(clonedTask, clonedTask.repeat.everyNumber);
        }
        if (clonedTask.repeat.everyInterval == "week") {
            clonedTask = calcRepeatedDays(clonedTask, 7 * clonedTask.repeat.everyNumber);
        }
        if (clonedTask.repeat.everyInterval == "month") {
            clonedTask = calcRepeatedMonth(clonedTask, clonedTask.repeat.everyNumber);
        }
        if (clonedTask.repeat.everyInterval == "year") {
            clonedTask = calcRepeatedYear(clonedTask, clonedTask.repeat.everyNumber);
        }
    }
    return clonedTask;
};


// *****************************************************************
// **** PRIVATE
// *****************************************************************
var calcRepeatedDays = function (ctask, dayDelta) {
    var groundDate = new Date();    // if (ctask.repeat.repeatOnCompleteDate) ...

    if (ctask.startDate && !ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.startDate;
        }
        ctask.startDate.setDate(groundDate.getDate() + dayDelta);
    }
    if (!ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        ctask.dueDate.setDate(groundDate.getDate() + dayDelta);
    }
    if (ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        var startToDueTimeDiff = ctask.dueDate.getTime() - ctask.startDate.getTime()
        ctask.dueDate.setDate(groundDate.getDate() + dayDelta);
        ctask.startDate.setTime(ctask.dueDate.getTime() - startToDueTimeDiff);
    }

    return ctask;
};


var calcRepeatedMonth = function (ctask, monthDelta) {
    var groundDate = new Date();    // if (ctask.repeat.repeatOnCompleteDate) ...

    if (ctask.startDate && !ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.startDate;
        }

        ctask.startDate.setMonth(groundDate.getMonth() + monthDelta);
    }
    if (!ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        ctask.dueDate.setMonth(groundDate.getMonth() + monthDelta);
    }
    if (ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        var startToDueTimeDiff = ctask.dueDate.getTime() - ctask.startDate.getTime()
        ctask.dueDate.setMonth(groundDate.getMonth() + monthDelta);
        ctask.startDate.setTime(ctask.dueDate.getTime() - startToDueTimeDiff);
    }

    return ctask;
};


var calcRepeatedYear = function (ctask, yearDelta) {
    var groundDate = new Date();    // if (ctask.repeat.repeatOnCompleteDate) ...

    if (ctask.startDate && !ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.startDate;
        }

        ctask.startDate.setFullYear(groundDate.getFullYear() + yearDelta);
    }
    if (!ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        ctask.dueDate.setFullYear(groundDate.getFullYear() + yearDelta);
    }
    if (ctask.startDate && ctask.dueDate) {
        if (ctask.repeat.repeatOnTaskDate) {
            groundDate = ctask.dueDate;
        }
        var startToDueTimeDiff = ctask.dueDate.getTime() - ctask.startDate.getTime()
        ctask.dueDate.setFullYear(groundDate.getFullYear() + yearDelta);
        ctask.startDate.setTime(ctask.dueDate.getTime() - startToDueTimeDiff);
    }

    return ctask;
};
