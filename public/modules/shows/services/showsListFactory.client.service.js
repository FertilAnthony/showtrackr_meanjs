'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('ShowsListFactory', ['$resource',
	function ($resource) {

		// Interface
		var factory = {
			getPaginatedShows: getPaginatedShows,
			getShowsById: getShowsById
		};
		return factory;

		// Implentation
		function getPaginatedShows() {
			return $resource('/api/shows/page/:pagination', {pagination:'@pagination'});
		}

		function getShowsById() {
			return $resource('/api/shows/:id', {id:'@id'});
		}
	}
]);