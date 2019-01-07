define([], function() {
    return new function() {
        var self = this;

        self.addOrder = function(idRoom, idClient, checkInDate, evictionDate, price, countSeats) {
            return $.ajax({
                url: '/booking/add',
                type: 'POST',
                data: {
                    idRoom: idRoom,
                    idClient: idClient,
                    checkInDate: checkInDate,
                    evictionDate: evictionDate,
                    price: price,
                    countSeats: countSeats
                }
            })
        };

        self.moveOut = function(idOrder) {
            return $.ajax({
                url: '/booking/moveOut/' + idOrder,
                type: 'GET'
            })
        };

        self.getBookingsByCurDate = function(curDate) {
            return $.ajax({
                url: '/booking/get/bookings/curDate/' + curDate,
                type: 'GET'
            })
        };

        self.getEndsBookings = function(curDate) {
            return $.ajax({
                url: '/booking/get/endsBookings/' + curDate,
                type: 'GET'
            })
        };

        self.getCountAllRequests = function() {
            return $.ajax({
                url: '/booking/get/countAllRequests',
                type: 'GET'
            })
        };

        self.getCountCurrentClients = function(curDate) {
            return $.ajax({
                url: '/booking/get/countCurrentClients/' + curDate,
                type: 'GET'
            })
        };

        self.getAllBookings = function() {
            return $.ajax({
                url: '/booking/get/all',
                type: 'GET'
            })
        };

        self.getBookingsByDate = function(date) {
            return $.ajax({
                url: '/booking/get/bookings/date/' + date,
                type: 'GET'
            })
        };

    }
});