define(['durandal/app', 'plugins/router', 'knockout', '../services/authorization'], function(app, router, ko, auth) {
    return function() {

        var self = this;

        self.logout = function() {
            auth.logout().then(function() {
                router.reset();
                router.deactivate();
                app.setRoot('viewmodels/login');
            })
        };

        self.activate = function() {

            var routes = [{
                route: '',
                moduleId: 'viewmodels/main',
                title: '',
                tooltip: 'Главная',
                icon: 'glyphicon-home',
                nav: true
            }, {
                route: 'rooms',
                moduleId: 'viewmodels/rooms',
                title: 'Номера',
                icon: '',
                nav: true
            }, {
                route: 'client',
                moduleId: 'viewmodels/client',
                title: 'Клиенты',
                icon: '',
                nav: true
            }, {
                route: 'new-booking',
                moduleId: 'viewmodels/new-booking',
                title: 'Оформление заявки',
                icon: '',
                nav: true
            }, {
                route: 'bookings',
                moduleId: 'viewmodels/bookings',
                title: 'Список заявок',
                icon: '',
                nav: true
            }];

            return router.map(routes)
                .buildNavigationModel()
                .activate();
        };

        self.router = router;
    }
});