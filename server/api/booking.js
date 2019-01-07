var express = require('express');
var app = express();
var booking = require('../services/booking');
var router = express.Router();

router.post('/booking/add', function (req, res) {
	booking.addOrder(req.body.idRoom,
		req.body.idClient,
		req.body.checkInDate,
		req.body.evictionDate,
		req.body.price,
		req.body.countSeats);
	res.json({
		success: true
	});
});

router.get('/booking/moveOut/:idOrder', function (req, res) {
	booking.moveOut(req.params.idOrder);
	res.json({
		success: true
	});
});

router.get('/booking/get/bookings/curDate/:curDate', function (req, res) {
	booking.getBookingsByCurDate(req.params.curDate, function (err, result) {
		res.json(result);
	});
});

router.get('/booking/get/endsBookings/:curDate', function (req, res) {
	booking.getEndsBookings(req.params.curDate, function (err, result) {
		res.json(result);
	});
});

router.get('/booking/get/countAllRequests', function (req, res) {
	booking.getCountAllRequests(function (err, result) {
		res.json(result);
	});
});

router.get('/booking/get/countCurrentClients/:curDate', function (req, res) {
	booking.getCountCurrentClients(req.params.curDate, function (err, result) {
		res.json(result);
	});
});

router.get('/booking/get/all', function (req, res) {
	booking.getAllBookings(function (err, result) {
		res.json(result);
	});
});

router.get('/booking/get/bookings/date/:date', function (req, res) {
	booking.getBookingsByDate(req.params.date, function (err, result) {
		res.json(result);
	});
});
module.exports = router;