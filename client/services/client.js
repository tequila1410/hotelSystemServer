define([], function() {
    return new function() {
        var self = this;

        self.findByName = function(name) {
            var url = "/client/findby/name/" + name;
            return $.ajax({
                url: url,
                type: "GET"
            })
        };

        self.findById = function(id) {
            var url = "/client/findby/id/" + id;
            return $.ajax({
                url: url,
                type: "GET"
            })
        };

        self.findByPhone = function(phone) {
            var url = "/client/findby/phone/" + phone;
            return $.ajax({
                url: url,
                type: "GET"
            })
        };

        self.editClient = function(id, name, passport, mobile, birthday, adress) {
            return $.ajax({
                url: '/client/edit',
                type: 'POST',
                data: {
                    id: id,
                    name: name,
                    passport: passport,
                    phone: mobile,
                    bdate: birthday,
                    adress: adress
                }
            })
        };
        
        self.addClient = function(name, passport, mobile, birthday, adress) {
            return $.ajax({
                url: '/client/add',
                type: 'POST',
                data: {                  
                    name: name,
                    passport: passport,
                    phone: mobile,
                    bdate: birthday,
                    address: adress
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
    };
});