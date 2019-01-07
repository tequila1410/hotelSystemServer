const path = require('path');
const express = require('express');
const router = express.Router();
const log = require('./services/logger').log;

module.exports.configure = function (app) {
  app.use(router);
  app.use(require("./api/authentication.js"));
  app.use(require("./api/client.js"));
  app.use(require("./api/room.js"));
  app.use(require("./api/booking.js"));
};
