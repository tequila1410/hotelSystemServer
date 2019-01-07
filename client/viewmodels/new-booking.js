define(['knockout', '../services/client', '../services/room', 'toastr', '../services/booking', 'plugins/router', 'viewmodels/client', '../js/jquery-ui'],
    function(ko, client, room, toastr, booking, router, clientViewModel) {
        return function() {
            var self = this;

            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.showMethod = "show";
            toastr.options.timeOut = "1500";

            self.toggle = ko.observable(true);

            self.selected = ko.observable();

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

            self.curDate = ko.observable(dd + '.' + mm + '.' + yyyy);
            self.minEvictionDate = ko.observable(yyyy + '-' + mm + '-' + ddInc);

            self.changeToggle = function() {
                self.toggle(!self.toggle());
                self.showAdditionalInfo(false);
                if (!self.toggle()) {
                    booking.getBookings(yyyy + '-' + mm + '-' + dd).then(function(data) {
                        self.bookings(data);
                    });
                }

            };

            self.showAdditionalInfo = ko.observable(false);

            self.searchValue = ko.observable();

            self.categories = ko.observableArray([]);

            self.seats = ko.observableArray();

            self.clientSearch = ko.observable(false);

            self.countSeats = ko.observable();

            self.availibleCountSeats = ko.observableArray();

            self.availibleCount = ko.observable();

            self.selectRoom = ko.observable(false);

            self.clients = ko.observableArray();

            self.client = ko.observable({
                'name': ''
            });

            self.roomNumber = ko.observable({
                'number': ''
            });

            self.rooms = ko.observableArray();

            self.emptyRoom = ko.observable(false);

            self.price = ko.observable(undefined);

            self.selectedCategory = ko.observable();

            self.getCountSeats = function() {
                var avlSeats = [];
                for (var i = 1; i <= self.countSeats(); i++) {
                    avlSeats.push(i);
                };
                self.availibleCountSeats(avlSeats);
            };

            self.getSeats = function() {
                room.getSeats(self.selectedCategory()).then(function(data) {
                    if (data.length == 0) {
                        self.seats([{
                            'countSeats': 'Мест нет !'
                        }]);
                    } else {
                        self.seats(data);
                        var avlSeats = [];
                        for (var i = 1; i <= self.seats()[0].countSeats; i++) {
                            avlSeats.push(i);
                        };
                        self.availibleCountSeats(avlSeats);
                    }
                }, function(err) {
                    console.log(err);
                })
            };

            room.getCategory().then(function(data) {
                self.categories(data);
                self.selected(data.name);

                room.getSeats(data[0].idCategories).then(function(data) {
                    if (data.length == 0) {
                        self.seats([{
                            'countSeats': 'Мест нет !'
                        }]);
                    } else {
                        self.seats(data);
                        var avlSeats = [];
                        for (var i = 1; i <= self.seats()[0].countSeats; i++) {
                            avlSeats.push(i);
                        };
                        self.availibleCountSeats(avlSeats);
                    }
                }, function(err) {
                    console.log(err);
                })
            }, function(err) {
                console.log(err);
            });

            self.updateTable = function() {
                client.findByName(self.searchValue()).then(function(data) {
                    self.nodes(data);
                }, function(err) {
                    console.log(err);
                })
            };


            self.updateRoomTable = function() {
                self.rooms([]);
                room.findByCategoryAndSeats(self.selectedCategory(), self.countSeats()).then(function(data) {
                    if (data.length > 0) {
                        self.rooms(data);
                    } else {
                        toastr.error('Не найдено записей, соответствующих Вашему запросу.');
                    }
                }, function(err) {
                    console.log(err);
                })
            };

            self.updateClientsTable = function() {
                if (self.searchValue() != undefined && (self.searchValue() != undefined && self.searchValue() != "")) {
                    if ($('#search-pattern').val() == 1) {
                        client.findByName(self.searchValue()).then(function(data) {
                            if (data.length != 0) {
                                self.clients(data);
                            } else {
                                toastr.error('Не найдено записей, соответствующих Вашему запросу.');
                            }
                        }, function(err) {
                            console.log(err);
                        })
                    } else {
                        client.findByPhone(self.searchValue()).then(function(data) {
                            if (data.length != 0) {
                                self.clients(data);
                            } else {
                                toastr.error('Не найдено записей, соответствующих Вашему запросу.');
                            }
                        }, function(err) {
                            console.log(err);
                        })
                    }
                } else {
                    toastr.warning('Введите Ваш запрос!');
                }
            };

            self.setRoomNumber = function() {
                self.roomNumber(this);
            }

            self.setClient = function() {
                self.client(this);
            }

            self.addClient = function() {
                router.navigate('/client');
            }

            var getTimeSpan = function() {
                var checkInDateSplit = getDate().checkInDate.split('-');
                var evictionDateSplit = getDate().evictionDate.split('-');
                var timeSpan;
                if (evictionDateSplit[1] == checkInDateSplit[1]) {
                    timeSpan = (evictionDateSplit[2] - 1 + 1) - (checkInDateSplit[2] - 1 + 1);
                } else {
                    timeSpan = (evictionDateSplit[2] - 1 + 1) + 31 - (checkInDateSplit[2] - 1 + 1);
                };
                return timeSpan;
            }

            var getDate = function() {
                return {
                    checkInDate: yyyy + '-' + mm + '-' + dd,
                    evictionDate: document.getElementById("evictionDate").value
                }
            };

            self.getPrice = function() {
                var price = self.roomNumber().price * getTimeSpan();
                self.price(price);
            };

            self.finishBooking = function() {
                if (!self.roomNumber().idRoom || !self.client().idClient) {
                    toastr.warning('Выберите клиента и/или комнату!');
                } else {
                    var price = self.roomNumber().price * getTimeSpan();
                    booking.addOrder(self.roomNumber().idRoom,
                        self.client().idClient,
                        getDate().checkInDate,
                        getDate().evictionDate,
                        price,
                        self.availibleCount()).then(function() {
                        toastr.success('Заявка успешно обработана!');
                    });
                    self.rooms([]);
                    self.clients([]);
                    self.searchValue('');
                    self.roomNumber({
                        'number': ''
                    });
                    self.client({
                        'name': ''
                    });
                    self.price('');
                    document.getElementById("evictionDate").value = "";
                }
            };

            var timeSpan = function(start, end) {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var startSplit = start.split('.');
                var endSplit = end.split('.');
                var datestart = new Date(startSplit[2], startSplit[1], startSplit[0]);
                var dateEnd = new Date(endSplit[2], endSplit[1], endSplit[0]);
                return Math.round(Math.abs((dateEnd.getTime() - datestart.getTime()) / (oneDay)));
            };
        }
    });