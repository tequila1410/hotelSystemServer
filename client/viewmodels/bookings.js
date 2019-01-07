define(['knockout', '../services/client', '../services/room', 'toastr', '../services/booking', '../js/jquery-ui'],
    function(ko, client, room, toastr, booking) {
        return function() {
            var self = this;

            self.toggle = ko.observable(true);

            self.showAdditionalInfo = ko.observable(false);

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.showMethod = "show";
            toastr.options.timeOut = "1500";

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

            self.changeToggle = function() {
                self.toggle(!self.toggle());
                self.showAdditionalInfo(false);
                if (!self.toggle()) {
                    allBookings();
                } else {
                    bookingsByCurDate();
                }
            };

            self.bookings = ko.observableArray();
            
            self.allBookings = ko.observableArray();

            self.infoTab = ko.observable({
                'number': '',
                'client': '',
                'dateCheck': '',
                'dateEviction': '',
                'countDays': '',
                'countClients': '',
                'price': '',
                'status': ''
            });

            self.roomTab = ko.observable({
                'number': '',
                'category': '',
                'bed': '',
                'status': '',
                'count': '',
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

            self.emptyRoom = ko.observable(false);

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
                if(info.status == 1){
                    self.activeOrder(true);
                    status = 'Активно'; 
                } else{
                    self.activeOrder(false);
                    status = 'Закрыто';
                }
                var countDays = timeSpan(info.dateCheck, info.dateEviction);
                room.findByNumber(info.number).then(function(data) {
                    if (data[0].status == '1') {
                        self.emptyRoom(true);
                        self.roomTab({
                            'number': data[0].number,
                            'category': data[0].categoryName,
                            'seats': data[0].countSeats,
                            'status': 'Свободно',
                            'countVisits': data[0].countVisits,
                            'price': data[0].price,
                        });
                    } else {
                        self.emptyRoom(false);
                        self.roomTab({
                            'number': data[0].number,
                            'category': data[0].categoryName,
                            'seats': data[0].countSeats,
                            'status': 'Занято',
                            'countVisits': data[0].countVisits,
                            'price': data[0].price
                        });
                    }
                    self.infoTab({
                        'number': info.number,
                        'client': info.name,
                        'dateCheck': info.dateCheck,
                        'dateEviction': info.dateEviction,
                        'countDays': countDays,
                        'countClients': info.countClients,
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

            var bookingsByCurDate = function() {
                booking.getBookingsByCurDate(yyyy + '-' + mm + '-' + dd).then(function(data) {
                    self.bookings(data);
                });
            };

            bookingsByCurDate();

            var allBookings = function() {
                booking.getAllBookings().then(function(data) {
                    self.allBookings(data);
                });
            };
            
            self.find = function(){
                var value = document.getElementById('searchValue').value;
                if(value == ""){
                    toastr.warning('Выберите дату!');
                } else {
                    booking.getBookingsByDate(value).then(function(data) {
                    if(data.length > 0){
                        self.allBookings(data);
                    } else{
                        allBookings();
                        toastr.error('Не найдено записей, соответствующих Вашему запросу.');
                    }
                });
                }
            };

        }
    });