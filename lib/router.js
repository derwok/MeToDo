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
              console.log("owner:"+ownerid);
              var tasksjson = JSON.stringify(Tasks.find({owner: ownerid}).fetch());
              this.response.setHeader('Content-Type', 'application/json');
              this.response.end(tasksjson);
          }
});
