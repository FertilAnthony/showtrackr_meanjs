'use strict';

//Shows service used to communicate Shows REST endpoints
angular.module('shows').factory('PaginatedShowsFactory', ['$resource',
	function($resource) {
		return $resource('/api/shows/page/:pagination', {pagination:'@pagination'});
	}
]);