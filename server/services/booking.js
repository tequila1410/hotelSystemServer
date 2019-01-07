var express = require('express');
var app = express();
var path = require('path');
var db = require('./mysql').getPool();

function addOrder(idRoom, idClient, checkInDate, evictionDate, price, countSeats) {
    var attr = {
        idRoom: idRoom,
        idClient: idClient,
        dateCheck: checkInDate,
        dateEviction: evictionDate,
        price: price,
        countClients: countSeats,
        status: 1
    }
    db.query('INSERT INTO request SET ?', [attr]);
    db.query('UPDATE room SET isEmpty = 0 WHERE idRoom = ?', [attr.idRoom]);
    db.query('UPDATE client SET countVisits = countVisits + 1 WHERE idClient = ?', [attr.idClient]);
};

function getBookingsByCurDate(curDate, callback) {
    db.query('SELECT req.idOrder AS idOrder, req.idClient, ' +
        'DATE_FORMAT(req.dateCheck, "%d.%m.%Y") AS dateCheck, DATE_FORMAT(dateEviction, "%d.%m.%Y") AS dateEviction, ' +
        'c.name AS name, r.number AS number, req.countClients AS countClients, req.status AS status ' +
        'FROM request req, client c, room r ' +
        'WHERE req.idClient = c.idClient AND req.idRoom = r.idRoom AND ' +
        '(? BETWEEN req.dateCheck AND req.dateEviction) AND req.status = 1', [curDate],
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });
};

function getEndsBookings(curDate, callback) {
    db.query('SELECT req.idOrder AS idOrder, req.idClient, ' +
        'DATE_FORMAT(req.dateCheck, "%d.%m.%Y") AS dateCheck, DATE_FORMAT(dateEviction, "%d.%m.%Y") AS dateEviction, ' +
        'c.name AS name, r.number AS number, req.status AS status ' +
        'FROM request req, client c, room r ' +
        'WHERE req.idClient = c.idClient AND req.idRoom = r.idRoom AND ' +
        'req.dateEviction = ? AND req.status = 1', [curDate],
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });
};

function getCountAllRequests(callback) {
    db.query('SELECT COUNT(*) as count FROM request',
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });
};

function getCountCurrentClients(curDate, callback) {
    db.query('SELECT SUM(countClients) as count FROM request WHERE ? BETWEEN dateCheck AND dateEviction AND status = 1', [curDate],
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });
};

function moveOut(idOrder) {
    db.query('UPDATE request SET status = 0 WHERE idOrder = ?', [idOrder]);
};

function getBookingsByDate(date, callback) {
    db.query('SELECT req.idOrder AS idOrder, req.idClient, ' +
        'DATE_FORMAT(req.dateCheck, "%d.%m.%Y") AS dateCheck, DATE_FORMAT(dateEviction, "%d.%m.%Y") AS dateEviction, ' +
        'c.name AS name, r.number AS number, req.countClients AS countClients, req.status AS status ' +
        'FROM request req, client c, room r ' +
        'WHERE req.idClient = c.idClient AND req.idRoom = r.idRoom AND (? BETWEEN req.dateCheck AND req.dateEviction)', [date],
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });;
};

function getAllBookings(callback) {
    db.query('SELECT req.idOrder AS idOrder, req.idClient, ' +
        'DATE_FORMAT(req.dateCheck, "%d.%m.%Y") AS dateCheck, DATE_FORMAT(dateEviction, "%d.%m.%Y") AS dateEviction, ' +
        'c.name AS name, r.number AS number, req.countClients AS countClients, req.status AS status ' +
        'FROM request req, client c, room r ' +
        'WHERE req.idClient = c.idClient AND req.idRoom = r.idRoom ',
        function(err, bookings) {
            if (err) {
                callback(err);
                return
            } else {
                callback(null, bookings);
            }
        });
};

module.exports = {
    "addOrder": addOrder,
    "getBookingsByCurDate": getBookingsByCurDate,
    'getEndsBookings': getEndsBookings,
    'getCountAllRequests': getCountAllRequests,
    'getCountCurrentClients': getCountCurrentClients,
    'moveOut': moveOut,
    'getBookingsByDate': getBookingsByDate,
    'getAllBookings': getAllBookings
}