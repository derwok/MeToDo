
// meteor does a slightly strange thing to control scoping.
// anything with 'var' is local to the scope of the file it occurs in,
// anything declared without 'var' is globally available across the app
// ;-)


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
