Router.configure({
  // set default application template for all routes
  layoutTemplate: 'appLayout'
});

Router.route('/', {name: 'home'});

Router.route('/exportimport', {name: 'exportimport'});

Router.route('/api/tasks', { where: 'server' })
    .get(function () {
      var json = Tasks.find().fetch(); // what ever data you want to return
      this.response.setHeader('Content-Type', 'application/json');
      this.response.end(JSON.stringify(json));
    });
