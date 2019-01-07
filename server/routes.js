const path = require('path');
const express = require('express');
const router = express.Router();
const log = require('./services/logger').log;

/* GET home page. */
router.get('/', function (req, res, next) {
  log.info("Get index html");
  res.sendFile(path.join(__dirname, "html/index.html"));
});

module.exports.configure = function (app) {
  app.use(router);
  app.use(require("./api/authentication.js"));
  app.use(require("./api/client.js"));
  app.use(require("./api/room.js"));
  app.use(require("./api/booking.js"));
};
