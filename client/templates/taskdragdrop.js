/**
 * Created by wok on 11.10.15.
 */


Template.task.MT_drag = function (evt) {
    console.log("DRAGGED!");
    evt.dataTransfer.setData("text", evt.target.id);
    console.log(evt);
};

Template.task.MT_dragEnter = function (evt) {
    evt.preventDefault();
    console.log("DRAGENTER!");
    var tr = $(evt.target).closest("tr");
    var targetTaskID = tr.attr('MTTaskID')
    console.log("TR.MTTaskID="+tr.attr('MTTaskID'));
    Session.set("CurrentDragTargetTaskID", targetTaskID)
};

Template.task.MT_dragOver = function (evt) {
    evt.preventDefault();
    return false;
};

Template.task.MT_dragLeave = function (evt) {
    evt.preventDefault();
    console.log("DRAGLEAVE!");
    Session.set("CurrentDragTargetTaskID", undefined)
};


Template.task.MT_drop = function (evt) {
    console.log("DROPPED!");
    evt.preventDefault();
    Session.set("CurrentDragTargetTaskID", undefined)
    // var data = evt.dataTransfer.getData("text");
    console.log(evt);
    // console.log("Data"+data);
};
