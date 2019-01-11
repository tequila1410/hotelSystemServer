var express = require('express');
var client = require('../services/client');
var router = express.Router();

router.get('/client/get_all', function (req, res) {
	client.getAllClients(function (err, result) {
		res.json(result);
	});
});

router.get('/client/findby/name/:name', function (req, res) {
	client.findByName(req.params.name, function (err, result) {
		res.json(result);
	});
});

router.get('/client/findby/id/:id', function (req, res) {
	client.findById(req.params.id, function (err, result) {
		res.json(result);
	});
});

router.get('/client/findby/phone/:phone', function (req, res) {
	client.findByPhone(req.params.phone, function (err, result) {
		res.json(result);
	});
});

router.post('/client/edit', function (req, res) {
	client.updateClient(req.body.id, req.body.name, req.body.passport, req.body.phone, req.body.bdate, req.body.address, function(err) {
		if (err) {
			res.status(500).json({
				done: false
			})
		} else {
			res.status(200).json({
				done: true
			})
		}
	});
});

router.post('/client/add', function (req, res) {
	client.insertClient(req.body.name, req.body.passport, req.body.phone, req.body.bdate, req.body.address, function(err) {
		if (err) {
			res.status(500).json({
				done: false
			})
		} else {
			res.status(200).json({
				done: true
			})
		}
	});
});

router.delete('/client/delete/:id', function (req, res) {
	client.deleteClient(req.params.id, function (err) {
		if(err) {
			res.status(500).json({
				done: false,
			})
		} else {
			res.status(200).json({
				done: true
			})
		}
	});
});

module.exports = router;