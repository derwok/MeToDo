Router.configure({
  // set default application template for all routes
  layoutTemplate: 'appLayout'
});

Router.route('/', {name: 'home'});

Router.route('/exportimport', {name: 'exportimport'});

Router.route('/api/tasks/:ownderid',  {
  where: 'server',
  action: function () {
            var ownerid = this.params.ownderid;
            console.log("Dump tasks for owner:"+ownerid);

            // concat active and archived tasks
            var tasks = Tasks.find({owner: ownerid}, {sort: [["createdAt","asc"]]}).fetch();
            tasks = tasks.concat(TasksArchive.find({owner: ownerid}, {sort: [["createdAt","asc"]]}).fetch());
            var tasksjson = JSON.stringify(tasks);

            this.response.setHeader('Content-Type', 'application/json; charset=utf-8');
            this.response.end(tasksjson);
          }
});
