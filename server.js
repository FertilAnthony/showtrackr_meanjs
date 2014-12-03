'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
	cluster = require('cluster'),
  	app = require('express')(),
  	cpuCount = require('os').cpus().length;

// settings
var configApi = require('./config/configPopcornApi');

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, {
	db: { native_parser: true },
	replset: { 
		rs_name: 'pt0', 
		connectWithNoPrimary: true, 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}, 
	server: { 
		readPreference: 'nearest', 
		strategy: 'ping',
		socketOptions: {
			keepAlive: 1
		}
	}
}, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

if(cluster.isMaster) {

    // Fork the child threads
    for (var i = 0; i < Math.min(cpuCount, configApi.workers); i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died, spinning up another!');
        cluster.fork();
    });

    // Is this the master API server? If so scrape
    if(configApi.master) {
        var domain = require('domain');
        var scope = domain.create();
        
        scope.run(function() {
            var helpers = require('./app/controllers/lib/helpers');
            // Launch the eztv scraper
            try {
                var CronJob = require('cron').CronJob;
                var job = new CronJob(configApi.scrapeTime, 
                    function(){
                        helpers.refreshDatabase();
                    }, function () {
                        // This function is executed when the job stops
                    },
                    true
                );
                console.log('Cron job started');
            } catch(ex) {
                console.log('Cron pattern not valid');
            }
            // Start extraction right now
            helpers.refreshDatabase();
        });

        scope.on('error', function(err) {
            console.log('Error:', err);
        });
    }

} else {
    // Start the app by listening on <port>
	app.listen(config.port);
}

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);