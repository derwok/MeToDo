
autoarchivetimer = null;

autoarchivefunction = function () {
    archiveDate = new Date();
    archiveDate.setDate(archiveDate.getDate() - DEFAULT_DAYS_UNTIL_CHECKED_TO_ARCHIVE);

    // Find checked tasks that are older than archive date
    archiveCandidates = Tasks.find({$and: [{checked: true},
                                           {dateLastWrite: {$lte: archiveDate}}
                                          ]
                                   });

    console.log("Autoarchive at "+(new Date())+"(Archive candidates: "+archiveCandidates.count()+")");
    if (archiveCandidates.count() > 0) {
        cands = archiveCandidates.fetch();
        for (var i=0; i<cands.length; i++) {
            archiveCandidate = cands[i];
            console.log( "   Archiving: "+archiveCandidate.text );
            Meteor.call("archiveTask", archiveCandidate._id);
        }
    }

    autoarchivetimer = Meteor.setTimeout(autoarchivefunction, DEFAULT_MS_UNTIL_REPEAT_AUTOARCHIVE);
};
