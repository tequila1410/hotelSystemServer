define(['durandal/app', 'knockout', '../services/authorization', 'plugins/router', 'toastr'], function(app, ko, auth, router, toastr) {
    return new function User() {

        toastr.options.positionClass = "toast-bottom-right";
        toastr.options.showMethod = "show";
        toastr.options.timeOut = "1500";

        var self = this;
        self.username = ko.observable();
        self.password = ko.observable();

        self.login = function() {
            auth.login(self.username(), self.password()).then(function() {
                    router.reset();
                    router.deactivate();
                    app.setRoot('viewmodels/shell');
                }),
                function(err) {
                    console.error(err);
                }
        };
    };
});