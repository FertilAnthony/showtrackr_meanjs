'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Show = mongoose.model('Show'),
	_ = require('lodash'),
	async = require('async'),
	request = require('request');

var apiKey = '59b911c4b1f1';

/**
 * Create a Show
 */
exports.create = function(req, res) {
	var show = new Show(req.body);
	show.user = req.user;

	show.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(show);
		}
	});
};

/**
 * Show the current Show
 */
exports.read = function(req, res) {
	res.jsonp(req.show);
};

/**
 * Update a Show
 */
exports.update = function(req, res) {
	var show = req.show ;

	show = _.extend(show , req.body);

	show.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(show);
		}
	});
};

/**
 * Delete an Show
 */
exports.delete = function(req, res) {
	var show = req.show ;

	show.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(show);
		}
	});
};

/**
 * List of Shows
 */
exports.list = function(req, res) {
	Show.find().sort('-created').populate('user', 'displayName').exec(function(err, shows) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shows);
		}
	});
};

/**
 * Show middleware
 */
exports.showByID = function(req, res, next, id) {
	Show.findById(id).populate('user', 'displayName').exec(function(err, show) {
		if (err) return next(err);
		if (! show) return next(new Error('Failed to load Show ' + id));
		req.show = show ;
		next();
	});
};

/**
 * Show authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.show.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

/**
 * Home top 12 shows
 */
exports.topShows = function(req, res, next) {
	var shows = [];

	async.waterfall([
		function(callback) {

			request.get('https://api.betaseries.com/shows/search?v=2.3&key=' + apiKey + '&order=followers&summary=true&nbpp=12', function(error, response, body) {
				if (error) return next(error);

				// On parcourt les series pour recuperer les images
				shows = JSON.parse(response.body).shows;

				for (var i in shows) {
					shows[i].picture = 'https://api.betaseries.com/pictures/shows?v=2.3&key=' + apiKey + '&height=313&width=209&id=' + shows[i].id;
				}
				callback(null, shows);
			});
		}
	], function (err, shows) {
		if (err) return next(err);
		res.status(200).send(shows);
	});
};

/**
 * Paginated list of Shows
 */
exports.paginationList = function(req, res, next) {
	var shows = [],
		page = req.params.pagination;

	async.waterfall([
		function(callback) {

			request.get('https://api.betaseries.com/shows/search?v=2.3&key=' + apiKey + '&order=followers&nbpp=20&page=' + page, function(error, response, body) {
		        if (error) return next(error);

		        // On parcourt les series pour recuperer les images
		        shows = JSON.parse(response.body).shows;

				for (var i in shows) {
					shows[i].picture = 'https://api.betaseries.com/pictures/shows?v=2.3&key=' + apiKey + '&height=360&width=555&id=' + shows[i].id;
		        	
		        	if (shows[i].status === 'Ended') {
		        		shows[i].endDate = parseInt(shows[i].creation, 10) + parseInt(shows[i].seasons, 10);
		        	}
		        }
		        callback(null, shows);
		    });
		}
	], function (err, shows) {
		if (err) return next(err);
		res.status(200).send(shows);
	});
};


/** 
 * Show detail
 */
exports.showDetail = function(req, res, next) {
	var showDetail = [],
		episodes = [],
		characters = [],
		showId = req.params.id;

	async.waterfall([
		// Detail generaux de la serie
		function(callback) {
			request.get('https://api.betaseries.com/shows/display?v=2.3&key=' + apiKey + '&id=' + showId, function(error, response, body) {
				if (error) return next(error);

				showDetail = JSON.parse(response.body).show;
				showDetail.picture = 'https://api.betaseries.com/pictures/shows?v=2.3&key=' + apiKey + '&height=380&width=255&id=' + showId;
				callback(null, showDetail);
			});
		},
		// Caracteres de la serie
		function(showDetail, callback) {
			request.get('https://api.betaseries.com/shows/characters?v=2.3&key=' + apiKey + '&id=' + showId, function(error, response, body) {
				if (error) return next(error);

				characters = JSON.parse(response.body).characters;
				showDetail.characters = characters;
				callback(null, showDetail);
			});
		},
		// Récupération de tous les episodes
		function(showDetail, callback) {
			var seasons = [];

			request.get('https://api.betaseries.com/shows/episodes?v=2.3&key=' + apiKey + '&id=' + showDetail.id, function(error, response, body) {
				if (error) return next(error);

				episodes = JSON.parse(response.body).episodes;
				showDetail.episodes_details = episodes;
				res.status(200).send(showDetail);
			});
			
		}
	]);
};