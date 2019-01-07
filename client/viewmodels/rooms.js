define(['knockout', '../services/room', 'toastr', 'js/modal'], function (ko, room, toastr, modal) {

    toastr.options.positionClass = "toast-bottom-right";
    toastr.options.showMethod = "show";
    toastr.options.timeOut = "1500";

    return function () {
        var self = this;

        self.rooms = ko.observableArray();

        self.isVisible = ko.observable(true);

        self.isInsert = ko.observable(false);

        self.clickEdit = ko.observable(true);

        self.searchValue = ko.observable();

        self.selectRoom = ko.observable(false);

        self.isEmpty = ko.observable(false);

        self.categories = ko.observableArray([]);

        self.status = ko.observableArray(['Свободно', 'Занято']);

        self.selectedCategory = ko.observable();

        self.infoTab = ko.observable({
            'id': '',
            'number': '',
            'category': '',
            'bed': '',
            'status': '',
            'count': '',
            'price': ''
        });

        self.getCategory = function () {
            return self.selectedCategory();
        }

        self.getStatus = function () {
            return self.infoTab().status == 'Свободно' ? 1 : 0;
        }

        self.showInfo = function () {
            var status;

            self.selectRoom(true);
            if (this.isEmpty == 1) {
                self.isEmpty(true);
                status = 'Свободно';

            } else {
                self.isEmpty(false);
                status = 'Занято';
            }

            self.infoTab({
                'id': this.idRoom,
                'number': this.number,
                'category': this.categoryName,
                'bed': this.countSeats,
                'status': status,
                'count': this.countVisits,
                'price': this.price
            });

            for (var i = 0; i < self.categories().length; i++) {
                if (self.infoTab().category === self.categories()[i].name) {
                    self.selectedCategory(i + 1);
                    break;
                }
            }
        };

        self.updateTable = function () {
            if (self.searchValue() != undefined && (self.searchValue() != undefined && self.searchValue() != "")) {
                room.findByNumber(self.searchValue()).then(function (data) {
                    if (data.length != 0) {
                        self.rooms(data);
                    } else {
                        toastr.error('Не найдено записей, соответствующих Вашему запросу.');
                        getAllData();
                    }
                }, function (err) {
                    console.log(err);
                })
            } else {
                toastr.warning('Введите Ваш запрос!');
                getAllData();
            }

        };

        self.addRoom = function () {
            self.selectRoom(true);
            self.clickEdit(false);
            self.isInsert(true);
            self.infoTab({
                'number': '',
                'category': '',
                'bed': '',
                'status': ''
            });
        }

        function getAllData() {
            room.getAll().then(function (data) {
                self.rooms(data);
            });
        };


        self.editValue = function () {
            self.clickEdit(false);
        };

        self.saveChanges = function () {
            if (self.isInsert()) {
                room.addRoom(self.infoTab().number, self.getCategory, self.infoTab().bed, self.getStatus);
            } else {
                room.editRoom(self.infoTab().id, self.infoTab().number, self.getCategory, self.infoTab().bed, self.getStatus);
            }
            self.clickEdit(true);
            self.selectRoom(false);
            getAllData();
        };

        getAllData();

        room.getCategory().then(function (data) {
            self.categories(data);
        }, function (err) {
            console.log(err);
        });
    }
});