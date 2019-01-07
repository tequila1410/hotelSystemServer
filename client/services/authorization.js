define(['toastr', 'plugins/router'], function (toastr, router) {

    //show notification on right side
    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.showMethod = "show";
    toastr.options.timeOut = "1100";

    return new function () {
        var self = this;
        

        self.isAuthenticated = function (success) {
            return $.ajax({
                url: "/auth/verifyAuthentication",
                type: "GET",
            })
        };

        self.login = function (username, password) {
            return $.ajax({
                url: "/auth/login",
                type: "POST",
                data: {
                    username: username,
                    password: password
                },
                success: function () {
                    toastr.success('Log in successful!');
                },
                statusCode: {
                    400: function (err) {
                        toastr.error(err.responseText);
                    },
                    401: function (err) {
                        toastr.error(err.responseText);
                    },
                    403: function (err) {
                        toastr.error(err.responseText);
                    },
                    500: function (err) {
                        toastr.error(err.responseText);
                    }
                }
            })
        };

        self.logout = function () {
            return $.ajax({
                url: "/auth/logout",
                type: "POST",
                success: function () {
                    toastr.warning('Logout...');
                },
                error: function (err) {
                    toastr.error('Something wrong...!', err);
                }
            })
        };
    };
});
