const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const server = require('./server');
const logger = require('./server/services/logger.js');
const log = logger.log;

if (cluster.isMaster) {
  console.log("Strating master...");
  log.info("Starting master...");
  log.info(`Starting ${numCPUs} process(es)...`);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {

  });

  cluster.on('online', function (worker) {
    log.info(`Worker ${worker.id}:${worker.process.pid} is online`);
  });

  cluster.on('exit', function (worker, code, signal) {
    log.info(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    log.info('Starting a new worker');
    cluster.fork();
  });

  cluster.on('death', function (worker, code, signal) {
    log.info(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    log.info('Starting a new worker');
    cluster.fork();
  });

  log.info(`Configure logger master...`);
  logger.configureMaster();
  log.info(`Master started with ${numCPUs} process(es).`);
} else {
  logger.configureWorker();
  log.info(`Starting server...`);
  server.start();
}
