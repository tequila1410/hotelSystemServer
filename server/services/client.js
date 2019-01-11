var express = require('express');
var app = express();
var path = require('path');
var db = require('./mysql').getPool();

function getAllClients(callback) {
	db.query(
		'SELECT * from client;',
		function (err, client, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, client);
			}
		});
}

function findById(id, callback) {
	db.query('SELECT * from client where idClient = ?', [id], function (err, client, fields) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, client);
		}
	});
};

function findByName(name, callback) {
	db.query('SELECT * from client where name = ?', [name], function (err, client, fields) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, client);
		}
	});
};

function findByPhone(phone, callback) {
	db.query('SELECT * from client where phone = ?', [phone], function (err, client, fields) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null, client);
		}
	});
};

function updateClient(id, name, passport, mobile, birth, address, callback) {
	var value = {name: name, passport: passport, address: address, birthDate: birth, phone: mobile};
	var where = {idClient: id};
	db.query('UPDATE client SET ? WHERE ?', [value, where], function (err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
		}
	});
};

function insertClient(name, passport, mobile, birth, address, callback) {
	var attr = {
		name       : name,
		passport   : passport,
		address    : address,
		birthDate  : birth,
		phone      : mobile,
		countVisits: 0
	};
	db.query('INSERT INTO client SET ?', [attr], function(err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
		}
	});
};

function deleteClient(id, callback) {
	db.query('DELETE FROM client WHERE idClient = ?', [id], function(err) {
		if(err) {
			callback(err);
			return;
		} else {
			callback(null)
		}
	});
}

module.exports = {
	'findByName'  : findByName,
	'findByPhone' : findByPhone,
	'findById'    : findById,
	'updateClient': updateClient,
	'insertClient': insertClient,
	'getAllClients': getAllClients,
	'deleteClient': deleteClient
};