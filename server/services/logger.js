const winston = require('winston');
const cluster = require('cluster');
const util = require('util');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
   'timestamp': true,
   'colorize': true
});
winston.add(winston.transports.File, {
   'timestamp': true,
   'datePattern': '.yyyy-MM-dd',
   'filename': 'application.log'
});

function logHandler(msg) {
    if (msg.cmd && msg.cmd === 'log') {
        var level = msg.level;
        var message = msg.msg;
        var meta = msg.meta;
        meta.worker = msg.worker;
        winston.log(level, message, meta);
    }
}

function configureMaster(){
  for (var id in cluster.workers) {
      var worker = cluster.workers[id];
      worker.on('message', logHandler);
  }
}

var MessageTransport = function(options){
    options = options || {};
    winston.Transport.call(this, options);
    this.name = "message";
    this.log = function(level, msg, meta, callback) {
        if (this.silent) {
            return callback(null, true);
        }

        if (this.stripColors) {
            msg = ('' + msg).replace(code, '');
        }

        var message = {
            cmd: 'log',
            worker: cluster.worker.id,
            level: level,
            msg: msg,
            meta: meta
        };

        process.send(message);

        this.emit('logged');

        callback(null, true);

        return message;
    };
}

util.inherits(MessageTransport, winston.Transport);

function configureWorker(){
    winston.remove(winston.transports.Console);
    winston.add(MessageTransport, {});
}

module.exports = {
  log: winston,
  configureMaster: configureMaster,
  configureWorker: configureWorker,
  morganStream: {
    write: function(message, encoding){
        winston.info(message);
    }
  },
  requestLogger: function (req,res,next){
    winston.info("Starting request processing...");
    next();
    winston.info("Request processed.");
  }
};
