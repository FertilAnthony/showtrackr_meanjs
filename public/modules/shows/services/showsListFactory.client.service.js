'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('ShowsListFactory', ['$resource',
	function ($resource) {

		// Interface
		var factory = {
			getPaginatedShows: getPaginatedShows,
			getShowsById: getShowsById,
			getSearchShows: getSearchShows,
			subscribeShow: subscribeShow,
			unsubscribeShow: unsubscribeShow
		};
		return factory;

		// Implentation
		function getPaginatedShows() {
			return $resource('/api/shows/page/:pagination', {pagination:'@pagination'});
		}

		function getShowsById() {
			return $resource('/api/shows/:id', {id:'@id'});
		}

		function getSearchShows() {
			return $resource('/api/shows/search/:search/page/:pagination', {search: '@search', pagination:'@pagination'});
		}

		function subscribeShow() {
			return $resource('/api/show/subscribe', {showId: '@showId'});
		}

		function unsubscribeShow() {
			return $resource('/api/show/unsubscribe', {showId: '@showId'});
		}
	}
]);