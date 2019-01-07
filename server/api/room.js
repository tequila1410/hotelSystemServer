var express = require('express');
var app = express();
var room = require('../services/room');
var router = express.Router();

router.get('/room/get/all', function (req, res) {
  room.getAll(function (err, result) {
    res.json(result);
  })
});

router.get('/room/findby/number/:number', function (req, res) {
  room.findByNumber(req.params.number, function (err, result) {
    res.json(result);
  })
});

router.get('/room/get/category', function (req, res) {
  room.getCategory(function (err, result) {
    res.json(result);
  })
});

router.get('/room/get/category/seats/:idCategory', function (req, res) {
  room.getSeats(req.params.idCategory, function (err, result) {
    res.json(result);
  })
});

router.post('/room/findby/category&seats', function (req, res) {
  room.findByCategoryAndSeats(req.body.idCategory, req.body.countSeats, function (err, result) {
    res.json(result);
  })
});


router.post('/room/edit', function (req, res) {
  room.updateRoom(req.body.id, req.body.number, req.body.category, req.body.countBed, req.body.status);
});

router.post('/room/add', function (req, res){
  room.insertRoom(req.body.number, req.body.category, req.body.countBed, req.body.status);
})

router.get('/room/get/emptyRoom', function (req, res) {
  room.getEmpty(function (err, result) {
    res.json(result);
  })
})

module.exports = router;