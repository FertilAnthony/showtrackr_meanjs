'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var shows = require('../../app/controllers/shows.server.controller');

	// Shows Routes
	app.route('/shows').get(shows.list);

	app.route('/api/shows/page/:pagination').get(shows.paginationList);
	app.route('/api/topshows').get(shows.topShows);

	app.route('/api/shows/:id').get(shows.showDetail);

	app.route('/api/shows/search/:search/page/:pagination').get(shows.searchShows);

	app.route('/api/show/subscribe').post(shows.subscribeShow);
	app.route('/api/show/unsubscribe').post(shows.unsubscribeShow);

	// Finish by binding the Show middleware
	app.param('showId', shows.showByID);
};
