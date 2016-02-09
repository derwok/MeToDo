/**
 * Created by wok on 08.02.16.
 *
 */

class TaskRepeater {
    constructor(templateTask) {
        this._cloneTask = new Task();
        this._cloneTask.cloneFromTask (templateTask);
        this._calcRepeatedDates();
        this._cloneTask.save();
    }

    get clone() {
        return this._cloneTask;
    }

    // ###### PRIVATE ##############

    _calcRepeatedDates() {
        if (this._cloneTask.repeat && this._cloneTask.repeat.repeat) {
            if (this._cloneTask.repeat.everyInterval == "day") {
                this._calcRepeatedDays(this._cloneTask.repeat.everyNumber);
            }
            if (this._cloneTask.repeat.everyInterval == "week") {
                this._calcRepeatedDays(7 * this._cloneTask.repeat.everyNumber);
            }
            if (this._cloneTask.repeat.everyInterval == "month") {
                this._calcRepeatedMonth(this._cloneTask.repeat.everyNumber);
            }
            if (this._cloneTask.repeat.everyInterval == "year") {
                this._calcRepeatedYear(this._cloneTask.repeat.everyNumber);
            }
        }
    };

    _calcRepeatedDays (dayDelta) {
        dayDelta = dayDelta * 1;    // force as number!
        var groundDate = new Date();    // if (this._cloneTask.repeat.repeatOnCompleteDate) ...
        if (this._cloneTask.startDate && !this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.startDate;
            }
            this._cloneTask.startDate = groundDate;   // setDate can't work across month. We must pull it up to grounddate, first.
            this._cloneTask.startDate.setDate(groundDate.getDate() + dayDelta);
        }
        if (!this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            this._cloneTask.dueDate = groundDate;   // setDate can't work across month. We must pull it up to grounddate, first.
            this._cloneTask.dueDate.setDate(groundDate.getDate() + dayDelta);
        }
        if (this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            var startToDueTimeDiff = this._cloneTask.dueDate.getTime() - this._cloneTask.startDate.getTime()
            this._cloneTask.dueDate = groundDate;   // setDate can't work across month. We must pull it up to grounddate, first.
            this._cloneTask.dueDate.setDate(groundDate.getDate() + dayDelta);
            this._cloneTask.startDate.setTime(this._cloneTask.dueDate.getTime() - startToDueTimeDiff);
        }
    };


    _calcRepeatedMonth(monthDelta) {
        monthDelta = monthDelta * 1;    // force as number!
        var groundDate = new Date();    // if (this._cloneTask.repeat.repeatOnCompleteDate) ...

        if (this._cloneTask.startDate && !this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.startDate;
            }

            this._cloneTask.startDate.setMonth(groundDate.getMonth() + monthDelta);
        }
        if (!this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            this._cloneTask.dueDate.setMonth(groundDate.getMonth() + monthDelta);
        }
        if (this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            var startToDueTimeDiff = this._cloneTask.dueDate.getTime() - this._cloneTask.startDate.getTime()
            this._cloneTask.dueDate.setMonth(groundDate.getMonth() + monthDelta);
            this._cloneTask.startDate.setTime(this._cloneTask.dueDate.getTime() - startToDueTimeDiff);
        }
    };


    _calcRepeatedYear(yearDelta) {
        yearDelta = yearDelta * 1;    // force as number!
        var groundDate = new Date();    // if (this._cloneTask.repeat.repeatOnCompleteDate) ...

        if (this._cloneTask.startDate && !this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.startDate;
            }

            this._cloneTask.startDate.setFullYear(groundDate.getFullYear() + yearDelta);
        }
        if (!this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            this._cloneTask.dueDate.setFullYear(groundDate.getFullYear() + yearDelta);
        }
        if (this._cloneTask.startDate && this._cloneTask.dueDate) {
            if (this._cloneTask.repeat.repeatOnTaskDate) {
                groundDate = this._cloneTask.dueDate;
            }
            var startToDueTimeDiff = this._cloneTask.dueDate.getTime() - this._cloneTask.startDate.getTime()
            this._cloneTask.dueDate.setFullYear(groundDate.getFullYear() + yearDelta);
            this._cloneTask.startDate.setTime(this._cloneTask.dueDate.getTime() - startToDueTimeDiff);
        }
    };
}

this.TaskRepeater = TaskRepeater;
