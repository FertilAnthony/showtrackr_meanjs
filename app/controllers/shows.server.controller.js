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