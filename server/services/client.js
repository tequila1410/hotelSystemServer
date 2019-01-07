var express = require('express');
var app = express();
var path = require('path');
var db = require('./mysql').getPool();

function findById(id, callback) {
    db.query('SELECT * from client where idClient = ?', [id], function (err, client, fields) {
        if (err) {
            callback(err);
            return
        } else {
            callback(null, client);
        }
    })
};

function findByName(name, callback) {
    db.query('SELECT * from client where name = ?', [name], function (err, client, fields) {
        if (err) {
            callback(err);
            return
        } else {
            callback(null, client);
        }
    })
};

function findByPhone(phone, callback) {
    db.query('SELECT * from client where phone = ?', [phone], function (err, client, fields) {
        if (err) {
            callback(err);
            return
        } else {
            callback(null, client);
        }
    })
};

function updateClient(id, name, passport, mobile, birth, adress) {
    var value = { name: name, passport: passport, address: adress, birthDate: birth, phone: mobile };
    var where = { idClient: id };
    db.query('UPDATE client SET ? WHERE ?', [value, where]);
};

function insertClient(name, passport, mobile, birth, address) {
    var attr = {
        name: name,
        passport: passport,
        address: address,
        birthDate: birth,
        phone: mobile,
        countVisits: 0
    }
    db.query('INSERT INTO client SET ?', [attr]);
};

module.exports = {
    'findByName'            : findByName,
    'findByPhone'           : findByPhone,
    'findById'              : findById,
    'updateClient'          : updateClient,
    'insertClient'          : insertClient
}