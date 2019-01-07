const express = require('express');
const path = require('path');

module.exports.configure = function (app) {
  app.use(express.static(path.join(__dirname, '../client')));
  app.use(express.static(path.join(__dirname, '../client/public')));
  app.use(express.static(path.join(__dirname, '../node_modules/knockout/build/output')));
  app.use(express.static(path.join(__dirname, '../node_modules/durandal')));
  app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
  app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
  app.use(express.static(path.join(__dirname, '../node_modules/requirejs')));
  app.use(express.static(path.join(__dirname, '../node_modules/text')));
  app.use(express.static(path.join(__dirname, '../node_modules/toastr')));
  app.use(express.static(path.join(__dirname, '../node_modules/bootstrap-datepicker/dist')));
};
