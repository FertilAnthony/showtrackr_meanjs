'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('core').factory('TopShowsFactory', ['$resource',
	function($resource) {
		return $resource('/api/topshows', {});
	}
]);