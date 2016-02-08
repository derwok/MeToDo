/**
 * Created by wok on 08.02.16.
 */

class TaskParser {
    constructor(orgText) {
        this._text = orgText;
    }

    parse() {
        var prio = this._taskParsePrio() * 1; // string to number
        var tags = this._taskParseTags();
        var star = this._taskParseStar();
        var result = this._taskParseDates();
        var startDate = result.startDate;
        var dueDate = result.dueDate;

        console.log("start:"+startDate+" due:"+dueDate);

        return {
            text: this._text,
            prio: prio,
            tags: tags,
            star: star,
            startDate: startDate,
            dueDate: dueDate
        };
    }



    // ################### PRIVATE ###########################
    _taskParsePrio() {
        var prioRe = /\#([\-0-9]+)/g;
        var match;
        var prio = 0;   // default: highest prio!

        match = prioRe.exec(this._text);
        if (match) {
            prio = match[1];
            this._text = this._text.replace(prioRe, "");   // delete prio from string
        }

        return prio;
    }


    _taskParseTags() {
        // RegExp for tags - matches "@home @pc" but not "me@somedoma.in"

        var tagRe = /([\s\,\;])(@[^@\s\,\;]+)/g;
        var match;
        var found = false;
        var tags = [];

        do {
            match = tagRe.exec(this._text);
            if (match) {
                tags.push(match[2]);
                found = true;
            }
        } while (match);
        if (found) {
            this._text = this._text.replace(tagRe, "$1");   // delete all tags from string, but keep prefix
        }
        this._text = this._text.replace(/\ +/g," ");      // clean up multiple spaces
        this._text = this._text.trim();

        return tags;
    };

    _taskParseStar() {
        var starRe = /\s*\*\*/;
        var match;
        var star = false;

        match = starRe.exec(this._text);
        if (match) {
            star = true;
            this._text = this._text.replace(starRe, "");   // delete star from string
        }

        return star;
    }


    _taskParseDates() {
        var dateRe = /[\s\,\;\.]([<>])([0-9]{4,4}-)?([0-9]{2,2}-)?([0-9]{1,2})/g;
        var match;
        var found = false;
        var startDate;
        var dueDate;

        do {
            match = dateRe.exec(this._text);
            if (match) {
                // Possible datestrings:
                // 30 => (currentyear YYYY/current month MM) YYYY-MM-30
                // 04-30 => (currentyear) YYYY-04-30
                // 2015-04-30 => 2015-04-30    ;-)
                var year = match[2];
                var month = match[3];
                var aDateStr = match[4];
                if (aDateStr.length < 2) {
                    aDateStr = "0"+aDateStr;
                }
                if (!month) {
                    var currentDate = new Date();
                    var shiftToFuture = 0;
                    if (aDateStr*1 < currentDate.getDate()) {   // user entered day lies in past!
                        shiftToFuture = 1;  // shift month to next month
                    }
                    month = ((new Date()).getMonth()+1+shiftToFuture)+"-";
                    if (month.length < 3) {
                        month = "0"+month;
                    }
                }
                aDateStr = month+aDateStr;

                if (!year) {
                    year = (new Date()).getFullYear()+"-";

                    // create currentDate with YYYY-MM-DD and no timezone and no time
                    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                    var currentDate  = (new Date(new Date() - tzoffset)).toISOString().slice(0,-14);
                    currentDate = new Date (currentDate);
                    if ((new Date(year+aDateStr)) < currentDate) {      // date would lie in past
                        year = ((new Date()).getFullYear() + 1)+"-";    // shift to next year
                    }
                }

                aDateStr = year+aDateStr;
                if (match[1] == ">") {
                    startDate = new Date(aDateStr);
                } else {
                    dueDate = new Date(aDateStr);
                }
                found = true;
            }
        } while (match);
        if (found) {
            this._text = this._text.replace(dateRe, "");   // delete all tags from string
        }
        this._text = this._text.replace(/\ +/g," ");      // clean up multiple spaces
        this._text = this._text.trim();

        return {
            startDate: startDate,
            dueDate: dueDate
        };
    }
}

this.TaskParser = TaskParser;

