
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
    console.log("taskParsePrio: " + text);

    var tagRe = /#[0-9]+"/g;
    var match;

    do {
        match = tagRe.exec(text);
        if (match) {
            console.log(match[1], match[2]);
        }
    } while (match);
};

