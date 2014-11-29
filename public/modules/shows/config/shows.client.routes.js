'use strict';

//Setting up route
angular.module('shows').config(['$stateProvider',
	function($stateProvider) {
		// Shows state routing
		$stateProvider.
		state('listShows', {
			url: '/shows/page/:pagination',
			templateUrl: 'modules/shows/views/list-shows.client.view.html',
			/*resolve: {
		        listShowsResolved: function(PaginatedShows, $stateParams) {
		        	console.log(PaginatedShows($stateParams.pagination));
		          return PaginatedShows($stateParams.pagination);
		        }
		    }*/
		}).
		state('viewShow', {
			url: '/shows/:showId',
			templateUrl: 'modules/shows/views/view-show.client.view.html'
		});
	}
]);