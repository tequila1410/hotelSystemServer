define(['knockout', '../services/client', '../services/room', 'toastr', '../services/booking', '../js/jquery-ui'],
    function(ko, client, room, toastr, booking) {
        return function() {
            var self = this;


            var today = new Date();
            var dd = today.getDate();
            var ddInc = today.getDate() + 1;
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (ddInc < 10) {
                ddInc = '0' + ddInc
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            self.showAdditionalInfo = ko.observable(false);

            self.emptyRoom = ko.observable(false);

            self.bookings = ko.observableArray();

            var fillTable = function() {
                booking.getEndsBookings(yyyy + '-' + mm + '-' + dd).then(function(data) {
                    self.bookings(data);
                });
                self.showAdditionalInfo(false);
            }

            fillTable();

            self.infoTab = ko.observable({
                'idRequest': '',
                'number': '',
                'client': '',
                'dateCheck': '',
                'dateEviction': '',
                'countDays': '',
                'price': '',
                'status': status
            });

            self.roomTab = ko.observable({
                'number': '',
                'category': '',
                'seats': '',
                'status': '',
                'countVisits': '',
                'price': ''
            });

            self.clientTab = ko.observable({
                'name': '',
                'passport': '',
                'phone': '',
                'bdate': '',
                'address': '',
                'countVisits': ''
            });

            self.countEmptyRooms = ko.observable();

            self.countCurrentClients = ko.observable();

            self.countAllRequests = ko.observable();

            self.activeOrder = ko.observable();

            var timeSpan = function(start, end) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var startSplit = start.split('.');
                var endSplit = end.split('.');
                var datestart = new Date(startSplit[2], startSplit[1], startSplit[0]);
                var dateEnd = new Date(endSplit[2], endSplit[1], endSplit[0]);
                return Math.round(Math.abs((dateEnd.getTime() - datestart.getTime()) / (oneDay)));
            };

            var fillTab = function(info) {
                var status;
                if (info.status == 1) {
                    self.activeOrder(true);
                    status = 'Активна';
                } else {
                    self.activeOrder(false);
                    status = 'Закрыта';
                }
                var countDays = timeSpan(info.dateCheck, info.dateEviction);
                room.findByNumber(info.number).then(function(data) {
                    if (data[0].status == '1') {
                        self.emptyRoom(true);
                        self.roomTab({
                            'number': data[0].number,
                            'category': data[0].category,
                            'seats': data[0].beds,
                            'status': 'свободно',
                            'countVisits': data[0].countVisits,
                            'price': data[0].price
                        });
                    } else {
                        self.emptyRoom(false);
                        self.roomTab({
                            'number': data[0].number,
                            'category': data[0].category,
                            'seats': data[0].beds,
                            'status': 'занято',
                            'countVisits': data[0].countVisits,
                            'price': data[0].price
                        });
                    }
                    self.infoTab({
                        'idRequest': info.idOrder,
                        'number': info.number,
                        'client': info.name,
                        'dateCheck': info.dateCheck,
                        'dateEviction': info.dateEviction,
                        'countDays': countDays,
                        'price': self.roomTab().price * countDays,
                        'status': status
                    });
                }, function(err) {
                    console.log(err);
                });
                client.findById(info.idClient).then(function(data) {
                    self.clientTab({
                        'name': data[0].name,
                        'passport': data[0].passport,
                        'phone': data[0].phone,
                        'bdate': data[0].birthDate,
                        'address': data[0].address,
                        'countVisits': data[0].countVisits
                    });
                }, function(err) {
                    console.log(err);
                });
            };

            self.showInfo = function() {
                self.showAdditionalInfo(true);
                fillTab(this);
                $("div[name=tabs]").tabs();
            };

            booking.getCountAllRequests().then(function(data) {
                self.countAllRequests(data[0].count);
            });

            booking.getCountCurrentClients(yyyy + '-' + mm + '-' + dd).then(function(data) {
                self.countCurrentClients(data[0].count);
            });

            room.getEmpty().then(function(data) {
                self.countEmptyRooms(data[0].countEmpty);
            });

            self.moveOut = function() {
                booking.moveOut(self.infoTab().idRequest).then(function() {
                    toastr.success('Заявка успешно обработана!');
                });
                fillTable();
            };

        }
    });