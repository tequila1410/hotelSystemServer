define([], function () {
    return new function () {
        var self = this;

        self.findByNumber = function (number) {
            var url = "/room/findby/number/" + number;
            return $.ajax({
                url: url,
                type: "GET"
            })
        };

        self.getAll = function () {
            return $.ajax({
                url: '/room/get/all',
                type: "GET"
            })
        };

        self.getCategory = function () {
            return $.ajax({
                url: '/room/get/category',
                type: "GET"
            })
        };


        self.getSeats = function (idCategory) {
            return $.ajax({
                url: '/room/get/category/seats/' + idCategory,
                type: "GET"
            })
        };

        self.getEmpty = function () {
            return $.ajax({
                url: '/room/get/emptyRoom',
                type: "GET"
            })
        };

        self.findByCategoryAndSeats = function (idCategory, countSeats) {
            return $.ajax({
                url: '/room/findby/category&seats',
                type: 'POST',
                data: {
                    idCategory: idCategory,
                    countSeats: countSeats
                }
            })
        };

        self.editRoom = function (id, number, category, countBed, status) {
            return $.ajax({
                url: '/room/edit',
                type: 'POST',
                data: {
                    id: id,
                    number: number,
                    category: category,
                    countBed: countBed,
                    status: status
                },
                error: function (err) {
                    console.log(err);
                }
            })
        };

        self.addRoom = function (number, category, countBed, status) {
            return $.ajax({
                url: '/room/add',
                type: 'POST',
                data: {
                    number: number,
                    category: category,
                    countBed: countBed,
                    status: status
                },
                error: function (err) {
                    console.log(err);
                }
            })
        };
    }
});