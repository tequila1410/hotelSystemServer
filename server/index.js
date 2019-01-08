module.exports = {
	start: function (port) {
		const path = require('path');
		const logger = require('./services/logger');
		const log = logger.log;
		const express = require('express');
		const morgan = require('morgan');
		const bodyParser = require('body-parser');
		const routes = require('./routes');
		const app = express();

		// Add headers
		app.use((req, res, next) => {

			// Website you wish to allow to connect
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

			// Request methods you wish to allow
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

			// Request headers you wish to allow
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

			// Set to true if you need the website to include cookies in the requests sent
			// to the API (e.g. in case you use sessions)
			res.setHeader('Access-Control-Allow-Credentials', true);

			// Pass to next layer of middleware
			next();
		});

		app.use(logger.requestLogger);
		app.use(morgan('combined', {
			'stream'   : logger.morganStream,
			'immediate': true
		}));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: false
		}));

		routes.configure(app);

		// no stacktraces leaked to user
		app.use((err, req, res) => {
			res.status(err.status || 500).send(err.message);
		});

		var cPort = port || 8081;
		app.listen(cPort, function () {
			log.info(`Listening for port ${cPort}.`);
		});
	}
};