var express = require('express');
var app = express();
var path = require('path');
var db = require('./mysql').getPool();

function getAll(callback) {
	db.query(
		'SELECT *, c.name as categoryName, c.price*r.countSeats as price from room r, category c where idCategory = idCategories;',
		function (err, room, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, room);
			}
		});
}

function findByNumber(number, callback) {
	db.query(
		'SELECT *, c.name as categoryName, c.price*r.countSeats as price from room r, category c where idCategory = idCategories and number = ?',
		[number],
		function (err, room, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, room);
			}
		});
}

function getCategory(callback) {
	db.query('SELECT * from category',
		function (err, category, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, category);
			}
		});
}

function getSeats(idCategory, callback) {
	db.query('SELECT DISTINCT countSeats from room WHERE isEmpty = 1 AND idCategory = ?', [idCategory],
		function (err, category, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, category);
			}
		});
}

function getEmpty(callback) {
	db.query('SELECT count(*) as countEmpty from room where isEmpty = 1',
		function (err, room, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, room);
			}
		});
}

function findByCategoryAndSeats(idCategory, countSeats, callback) {
	db.query('SELECT r.idRoom, r.number, c.price * r.countSeats as price ' +
		'FROM room r, category c ' +
		'WHERE isEmpty = 1 AND r.idCategory = ? AND r.idCategory = c.idCategories AND r.countSeats = ?',
		[idCategory, countSeats],
		function (err, room, fields) {
			if (err) {
				callback(err);
				return;
			} else {
				callback(null, room);
			}
		});
}

function updateRoom(id, number, idCategory, beds, status, callback) {
	var value = {number: number, idCategory: idCategory, countSeats: beds, isEmpty: status};
	var where = {idRoom: id};
	db.query('UPDATE room SET ? WHERE ?', [value, where], function (err) {
		if (err) {
			callback(err);
			return;
		} else {
			callback(null);
		}
	});
};

function insertRoom(number, idCategory, beds, status) {
	var attr = {
		number     : number,
		idCategory : idCategory,
		countSeats : beds,
		countVisits: 0,
		isEmpty    : status
	};
	db.query('INSERT INTO room SET ?', [attr]);
};

module.exports = {
	'getAll'                : getAll,
	'findByNumber'          : findByNumber,
	'getCategory'           : getCategory,
	'findByCategoryAndSeats': findByCategoryAndSeats,
	'getSeats'              : getSeats,
	'getEmpty'              : getEmpty,
	'updateRoom'            : updateRoom,
	'insertRoom'            : insertRoom
};