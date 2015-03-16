
// meteor does a slightly strange thing to control scoping.
// anything with 'var' is local to the scope of the file it occurs in,
// anything declared without 'var' is globally available across the app
// ;-)

taskParsePrio = function (text) {
    var prioRe = /\#([0-9]+)/g;
    var match;
    var prio = 99;

    match = prioRe.exec(text);
    if (match) {
        prio = +match[1];
        text = text.replace(prioRe, "");   // delete prio from string
    }

    return {text: text, prio: prio};
};


taskParseTags = function (text) {
    var tagRe = /@[^\s]+/g;
    var match;
    var found = false;
    var tags = [];

    do {
        match = tagRe.exec(text);
        if (match) {
            console.log(match[0]);
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

