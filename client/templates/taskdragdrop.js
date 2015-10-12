/**
 * Created by wok on 11.10.15.
 */


Template.task.MT_drag = function (evt) {
    var tr = $(evt.target).closest("tr");
    var draggedTaskID = tr.attr('MTTaskID');
    evt.dataTransfer.setData("MTTaskID", draggedTaskID);
    console.log("DRAGGED!" + draggedTaskID);
    console.log(evt);
};


Template.task.MT_dragOver = function (evt) {
    var tr = $(evt.target).closest("tr");
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

    var tr = $(evt.target).closest("tr");
    var targetTaskID = tr.attr('MTTaskID');
    var draggedTaskID = evt.dataTransfer.getData("MTTaskID");
    console.log("DROPPED! " + draggedTaskID + " => "+ targetTaskID);
    console.log(evt);
};
