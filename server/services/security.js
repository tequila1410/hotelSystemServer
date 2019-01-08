var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var db = require('./mysql').getPool();

function authentication(req, res, next) {
	db.query('SELECT login as NAME, password as PASS from personal where login = ?', [req.body.username],
		function (err, user, fields) {
			if (err) console.log(err);
			if (user.length == 0) {
				return res.status(404).json({
					success: false,
				});
			} else {
				if (err) console.log(err);
				if (req.body.password === user[0].PASS) {
					req.user = user;
					next();
				} else {
					return res.status(404).json({
						success: false,
					});
				}
			}
		});
}

module.exports = {
	'authentication': authentication
};