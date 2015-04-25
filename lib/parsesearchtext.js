
// Parses search strings to MongoDB queries.
// Binding order (strong to weak) is
//      "!" => $not
//      " " => $and
//      "|" => $or
// Examples:
//      aa bb   => {$and: [aa,bb]}
//      aa !bb  => {$and: [aa, {$not: [bb]}]}
//      aa|bb   => {$or: [aa,bb]}
//      aa !bb|cc !dd  => {$or: [
//                                {$and: [aa, {$not: [bb]}]},
//                                {$and: [cc, {$not: [dd]}]}]}

searchParseAll = function (searchtext) {
    var searchcriteria = {};

    searchcriteria = searchParseOr(searchtext);

    return searchcriteria;
};



// ------------ PRIVATE ---------------------------
var searchParseOr = function (searchtext) {
    var searchcriteria = {};

    if (searchtext.indexOf("|") >= 0) {  // | is interpreted as boolean $or
        var fragmentsString = searchtext.split("|");
        var fragmentsOr = [];
        for (var i=0; i<fragmentsString.length; i++) {
            if (fragmentsString[i] != "") {
                var fragmentsAnd = searchParseAnd(fragmentsString[i]);
                fragmentsOr.push(fragmentsAnd);
            }
        }
        searchcriteria = {$or: fragmentsOr};
    } else {
        searchcriteria = searchParseAnd(searchtext)
    }
    return searchcriteria;
};

var searchParseAnd = function (searchtext) {
    var searchcriteria = {};

    if (searchtext.indexOf(" ") >= 0) {  // | is interpreted as boolean $or
        var fragmentsString = searchtext.split(" ");
        var fragmentsAnd = [];
        for (var i=0; i<fragmentsString.length; i++) {
            if (fragmentsString[i] != "") {
                var fragmentsNot = searchParseNot(fragmentsString[i]);
                fragmentsAnd.push(fragmentsNot);
            }
        }
        searchcriteria = {$and: fragmentsAnd};
    } else {
        searchcriteria = searchParseNot(searchtext)
    }
    return searchcriteria;
};

var searchParseNot = function (searchtext) {
    var searchcriteria = {};
    var invertedByNot = false;
    if (searchtext.indexOf("!") == 0) {
        searchtext = searchtext.replace(/^!/, "");
        invertedByNot = true;
    }

    // escape all regexp chars for literal search
    searchtext = searchtext.replace(/[[-[\]{}()*+?.,\\^$|#]/g, "\\$&");    // all '*' to '\*'

    var rex = new RegExp(searchtext,"i");
    if (invertedByNot) {
        return {orgText: {$not: {$regex: rex}}};
    } else {
        return {orgText: {$regex: rex}};
    }
};
