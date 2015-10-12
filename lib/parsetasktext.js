
// meteor does a slightly strange thing to control scoping.
// anything with 'var' is local to the scope of the file it occurs in,
// anything declared without 'var' is globally available across the app
// ;-)

taskParseAll = function (text) {
    var result = taskParsePrio(text);
    var prio = result.prio * 1; // string to number

    result = taskParseTags(result.text);
    var tags = result.tags;

    result = taskParseStar(result.text);
    var star = result.star;

    result = taskParseDates(result.text);
    var startDate = result.startDate;
    var dueDate = result.dueDate;

    console.log("start:"+startDate+" due:"+dueDate);

    return {text: result.text,
        prio: prio,
        tags: tags,
        star: star,
        startDate: startDate,
        dueDate: dueDate};
};


// replace @@ in tasktext to current search
replaceDoubleAtWithCurrentTag = function (text) {
    var doubleAtRe = /([\s,;.])@@([^@]*)/;
    var match;
    var prio = 0;   // default: highest prio!

    match = doubleAtRe.exec(text);
    if (match) {
        var searchstring = Session.get("search-query");
        // do we have a simple "@abcde" search?
        if (searchstring && /^\@[^\@\|]+$/.test(searchstring)) {
            text = text.replace(doubleAtRe, "$1"+searchstring+"$2");
        }
    }

    return text;
};


// ------------ PRIVATE ---------------------------
var taskParsePrio = function (text) {
    var prioRe = /\#([\-0-9]+)/g;
    var match;
    var prio = 0;   // default: highest prio!

    match = prioRe.exec(text);
    if (match) {
        prio = match[1];
        text = text.replace(prioRe, "");   // delete prio from string
    }

    return {text: text, prio: prio};
};


var taskParseTags = function (text) {
    // RegExp for tags - matches "@home @pc" but not "me@somedoma.in"

    var tagRe = /([\s\,\;])(@[^@\s\,\;]+)/g;
    var match;
    var found = false;
    var tags = [];

    do {
        match = tagRe.exec(text);
        if (match) {
            tags.push(match[2]);
            found = true;
        }
    } while (match);
    if (found) {
        text = text.replace(tagRe, "$1");   // delete all tags from string, but keep prefix
    }
    text = text.replace(/\ +/g," ");      // clean up multiple spaces
    text = text.trim();

    return {text: text, tags: tags};
};

var taskParseStar = function (text) {
    var starRe = /\s*\*\*/;
    var match;
    var star = false;

    match = starRe.exec(text);
    if (match) {
        star = true;
        text = text.replace(starRe, "");   // delete star from string
    }

    return {text: text, star: star};
};


var taskParseDates = function (text) {
    var dateRe = /[\s\,\;\.]([<>])([0-9]{4,4}-)?([0-9]{2,2}-)?([0-9]{1,2})/g;
    var match;
    var found = false;
    var startDate;
    var dueDate;

    do {
        match = dateRe.exec(text);
        if (match) {
            // Possible datestrings:
            // 30 => (currentyear YYYY/current month MM) YYYY-MM-30
            // 04-30 => (currentyear) YYYY-04-30
            // 2015-04-30 => 2015-04-30    ;-)
            var year = match[2];
            var month = match[3]
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
        text = text.replace(dateRe, "");   // delete all tags from string
    }
    text = text.replace(/\ +/g," ");      // clean up multiple spaces
    text = text.trim();

    return {text: text,
        startDate: startDate,
        dueDate: dueDate};
};
