requirejs.config({
  paths: {
    'durandal': 'js',
    'plugins': 'js/plugins',
    'transitions': 'js/transitions',
    'knockout': 'knockout-latest',
    'jquery': 'jquery.min'
  }
});

define(['durandal/system',
  'durandal/app',
  'durandal/viewLocator',
  './services/authorization'
],
  function (system,
    app,
    viewLocator,
    authorization
  ) {

    system.debug(true);

    app.title = 'Hotel System';

    app.configurePlugins({
      router: true,
      dialog: true
    });

    viewLocator.useConvention();

    app.start().then(function () {
      authorization.isAuthenticated().then(function () {
        app.setRoot('viewmodels/shell');
      }, function () {
        app.setRoot('viewmodels/login');
      });
    });
  });
