'use strict';

//Setting up route
angular.module('shows').config(['$stateProvider',
	function($stateProvider) {
		// Shows state routing
		$stateProvider.
		state('listShows', {
			url: '/shows/page/:pagination',
			templateUrl: 'modules/shows/views/list-shows.client.view.html',
			controller: 'ShowsController',
			/*resolve: {
		        listShowsResolved: function(ShowsListService, $stateParams) {
		          	ShowsListService.getPaginatedShowsList().then(function(shows) {
		          		return shows;
		          	});
		        }
		    }*/
		}).
		state('showDetail', {
			url: '/shows/:showId',
			templateUrl: 'modules/shows/views/view-show.client.view.html'
		});
	}
]);