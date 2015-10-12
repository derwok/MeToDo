/**
 * Created by wok on 11.10.15.
 */


Template.task.MT_drag = function (evt) {
    var tr = $(evt.target).closest("tr.task");
    var draggedTaskID = tr.attr('MTTaskID');
    var draggedTaskArea = tr.prevAll("tr.taskarea:first").attr('MTTaskArea');

    evt.dataTransfer.setData("MTTaskID", draggedTaskID);
    evt.dataTransfer.setData("MTTaskArea", draggedTaskArea);
    console.log("DRAGGED!" + draggedTaskID + " area:"+draggedTaskArea);
    console.log(evt);
};


Template.task.MT_dragOver = function (evt) {
    var tr = $(evt.target).closest("tr.task");
    var targetTaskID = tr.attr('MTTaskID');
    var draggable = tr.attr('draggable');
    //console.log("DRAGOVER:"+draggable+" targetID:"+targetTaskID);
    if (!targetTaskID) {    // target is no task!
        Session.set("CurrentDragTargetTaskID", undefined);
    } else {    // target is task!
        if (Session.get("CurrentDragTargetTaskID") !=  targetTaskID) {  // target task has changed?
            Session.set("CurrentDragTargetTaskID", targetTaskID);
        }
    }

    // We dont' allow to drag over a <tr> that is not draggable itself.
    // e.g. we dont allow to drop on checked (finished) tasks
    if (draggable && draggable == "true") {
        evt.preventDefault();
        return false;
    }
    return true;
};


Template.task.MT_dragLeave = function (evt) {
    Session.set("CurrentDragTargetTaskID", undefined);
    //console.log("DRAGLEAVE!" + Session.get("CurrentDragTargetEnterCount"));
    //console.log(evt);
};


Template.task.MT_drop = function (evt) {
    evt.preventDefault();
    Session.set("CurrentDragTargetEnterCount", 0);
    Session.set("CurrentDragTargetTaskID", undefined);

    var draggedTaskID = evt.dataTransfer.getData("MTTaskID");
    var draggedTaskArea = evt.dataTransfer.getData("MTTaskArea");
    var draggedTask = Tasks.findOne({_id: draggedTaskID});

    var trBelow = $(evt.target).closest("tr.task");
    var taskIDBelow = trBelow.attr('MTTaskID');
    // var taskAreaBelow = trBelow.attr('MTTaskArea');
    var taskAreaBelow = trBelow.prevAll("tr.taskarea:first").attr('MTTaskArea');
    var taskBelow = Tasks.findOne({_id: taskIDBelow});

    var trAbove = $(trBelow).prevAll("tr.task:first");
    var taskIDAbove = undefined;
    var taskAreaAbove = undefined;
    var taskAbove = undefined;
    if (trAbove[0]) {
        taskIDAbove = trAbove.attr('MTTaskID');
        // taskAreaAbove = trAbove.attr('MTTaskArea');
        taskAreaAbove = trAbove.prevAll("tr.taskarea:first").attr('MTTaskArea');
        taskAbove = Tasks.findOne({_id: taskIDAbove});
    }

    console.log("DROPPED! " + draggedTaskID + "("+draggedTaskArea+") => "+ taskIDBelow);
    console.log("   above:"+taskIDAbove+" ("+taskAreaAbove+")");
    console.log("   below:"+taskIDBelow+" ("+taskAreaBelow+")");

    if (taskIDAbove == undefined) { // at top of STARRED
        var patchedOrgText = draggedTask.orgText;
        if (patchedOrgText.search("\\*\\*") == -1) {  // expected stars in string?
            patchedOrgText = patchedOrgText + " **";
        }
        if (patchedOrgText.search(" #"+draggedTask.prio) >-1) {  // expected prio in string?
            patchedOrgText = patchedOrgText.replace(" #"+draggedTask.prio, " #"+(taskBelow.prio -1));
        } else {
            patchedOrgText = patchedOrgText+" #"+(taskBelow.prio -1);
        }

        Tasks.update(draggedTaskID, {$set: {
            star: true,
            dateLastWrite: new Date(),
            prio: taskBelow.prio -1,
            orgText: patchedOrgText
        }});
        return;
    }

    if (taskAreaAbove == "STARRED_TASKS" && taskAreaBelow == "HOT_TASKS") { // at top of HOT_TASKS
        patchedOrgText = draggedTask.orgText;
        patchedOrgText = patchedOrgText.replace(" \\*\\*", ""); // remove star
        if (patchedOrgText.search(" #"+draggedTask.prio) >-1) {  // expected prio in string?
            patchedOrgText = patchedOrgText.replace(" #"+draggedTask.prio, " #"+(taskBelow.prio -1));
        } else {
            patchedOrgText = patchedOrgText+" #"+(taskBelow.prio -1);
        }

        // create currentDate with YYYY-MM-DD and no timezone and no time
        var dueDateRe = /[\s\,\;\.]([<])([0-9]{4,4}-)?([0-9]{2,2}-)?([0-9]{1,2})/;
        var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        var currentDate  = (new Date(new Date() - tzoffset)).toISOString().slice(0,-14);
        if (patchedOrgText.search(dueDateRe) >-1) {  // expected due in string?
            patchedOrgText = patchedOrgText.replace(dueDateRe, " <"+currentDate);
        } else {
            patchedOrgText = patchedOrgText+" <"+currentDate;
        }

        Tasks.update(draggedTaskID, {$set: {
            star: false,
            dateLastWrite: new Date(),
            prio: taskBelow.prio -1,
            orgText: patchedOrgText,
            dueDate: new Date (currentDate)
        }});
        return;
    }

};
