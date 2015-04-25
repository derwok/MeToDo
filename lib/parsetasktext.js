
// meteor does a slightly strange thing to control scoping.
// anything with 'var' is local to the scope of the file it occurs in,
// anything declared without 'var' is globally available across the app
// ;-)

taskParseAll = function (text) {
    var result = taskParsePrio(text);
    var prio = result.prio * 1;

    result = taskParseTags(result.text);
    var tags = result.tags;

    result = taskParseStar(result.text);
    var star = result.star;

    return {text: result.text,
        prio: prio,
        tags: tags,
        star: star};
};


// ------------ PRIVATE ---------------------------
var taskParsePrio = function (text) {
    var prioRe = /\#([0-9]+)/g;
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
    var tagRe = /@[^\s]+/g;
    var match;
    var found = false;
    var tags = [];

    do {
        match = tagRe.exec(text);
        if (match) {
            tags.push(match[0]);
            found = true;
        }
    } while (match);
    if (found) {
        text = text.replace(tagRe, "");   // delete all tags from string
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
