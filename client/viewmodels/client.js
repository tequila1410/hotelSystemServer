define(['knockout', '../services/client', 'toastr'], function(ko, client, toastr) {
    return function() {
        var self = this;

        toastr.options.positionClass = "toast-bottom-right";
        toastr.options.showMethod = "show";
        toastr.options.timeOut = "1500";

        self.clickEdit = ko.observable(true);

        self.searchValue = ko.observable();

        self.isInsert = ko.observable(false);

        self.selectClient = ko.observable(false);

        self.clients = ko.observableArray();

        self.infoTab = ko.observable({
            'id': '',
            'name': '',
            'passport': '',
            'phone': '',
            'bday': '',
            'adress': '',
            'visits': ''
        });

        self.updateTable = function() {
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


        self.showInfo = function() {
            self.selectClient(true);

            self.infoTab({
                'id': this.idClient,
                'name': this.name,
                'passport': this.passport,
                'phone': this.phone,
                'bday': this.birthDate,
                'adress': this.address,
                'visits': this.countVisits
            })
        }

        self.editValue = function() {
            self.clickEdit(false);
        }


        self.addClient = function() {
            self.selectClient(true);
            self.clickEdit(false);
            self.isInsert(true);
            self.infoTab({
                'name': '',
                'passport': '',
                'phone': '',
                'bday': '',
                'adress': ''
            });
        }

        self.saveChanges = function() {
            if (self.isInsert()) {
                client.addClient(self.infoTab().name, self.infoTab().passport, self.infoTab().phone, self.infoTab().bday, self.infoTab().adress);
            } else {
                client.editClient(self.infoTab().id, self.infoTab().name, self.infoTab().passport, self.infoTab().phone, self.infoTab().bday, self.infoTab().adress);
            }
            self.clickEdit(true);
            self.searchValue(self.infoTab().name);
            self.updateTable();
            self.selectClient(false);
        };
    };
});