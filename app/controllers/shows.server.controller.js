'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Show = mongoose.model('Show'),
	_ = require('lodash'),
	async = require('async'),
	request = require('request'),
	configApi = require('../../config/configPopcornApi');

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
exports.paginationList = function(req, res) {
 	var page = req.params.pagination - 1;   
    var offset = page * configApi.pageSize;

    // support older version
    if (req.params.page == 'all') {

      Show.find({num_seasons: { $gt: 0 }}).sort({ title: -1 }).exec(function (err, docs) {
        res.json(docs);
      });  

    } else {

      var query = {num_seasons: { $gt: 0 }};
      var data = req.query;
      
      if (!data.order) 
      	data.order = -1;
      	
      var sort = {'rating.votes':  data.order, 'rating.percentage':  data.order}
      // filter elements

      if (data.keywords) {
        var words = data.keywords.split(' ');
        var regex = data.keywords.toLowerCase();
        if(words.length > 1) {
          var regex = '^';
          for(var w in words) {
            regex += '(?=.*\\b'+RegExp.escape(words[w].toLowerCase())+'\\b)';
          }
          regex += '.+';
        }
        query = {title: new RegExp(regex,'gi'),num_seasons: { $gt: 0 }};
      }

      if (data.sort) {
        if(data.sort == 'year') sort = {year: data.order};
        if(data.sort == 'updated') sort = {'episodes.first_aired':  data.order};
        if(data.sort == 'name') sort = {title:  (data.order * -1)};
      }

      if(data.genre && data.genre != 'All') {
        query = {genres : data.genre,num_seasons: { $gt: 0 }}
      }

      // paging
      Show.find(query,{ _id: 1, imdb_id: 1, tvdb_id:1, title:1, year:1, images:1, slug:1, synopsis:1, num_seasons:1, last_updated:1}).sort(sort).skip(offset).limit(configApi.pageSize).exec(function (err, docs) {
        res.json(docs);
      });

    }
};

/** 
 * Show detail
 */
exports.showDetail = function(req, res) {
	Show.findOne({imdb_id: req.params.id}).exec(function (err, docs) {
        if(Array.isArray(docs)) docs = docs[0];
        res.json(docs);
    });
};

/**
 * Search shows -> a approfondir
 */
 exports.searchShows = function(req, res) {
 	var page = req.params.pagination - 1;
    var offset = page * configApi.pageSize;    
    var keywords = new RegExp(RegExp.escape(req.params.search.toLowerCase()),"gi");

    Show.find({title: keywords,num_seasons: { $gt: 0 }}, { _id: 1, imdb_id: 1, tvdb_id:1, title:1, year:1, images:1, slug:1, synopsis:1, num_seasons:1, last_updated:1}).sort({ title: -1 }).skip(offset).limit(configApi.pageSize).exec(function (err, docs) {
      res.json(docs);
    });
 };

/**
 * Add shows to favorite
 */
exports.subscribeShow = function(req, res) {
	var showId = req.query.showId,
		user = req.user;

	if (user.subscribeShows.indexOf(showId) === -1) {
		user.subscribeShows.push(showId);
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		return res.status(200).send({
			message: 'You\'re already follow this show'
		});
	}
	
};

/**
 * Remove shows from favorite
 */
exports.unsubscribeShow = function(req, res) {
	var showId = req.query.showId,
		user = req.user,
		index = user.subscribeShows.indexOf(showId);

	if (index !== -1) {
		user.subscribeShows.splice(index, 1);
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		return res.status(200).send({
			message: 'You\'re not following this show'
		});
	}
};