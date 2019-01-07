var mysql = require('mysql');
var config = require('../config/db.json');

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : config.host,
  user            : config.user,
  password        : config.password,
  database        : config.database
});


function getPool() {
  return pool;
};

module.exports.getPool = getPool;
