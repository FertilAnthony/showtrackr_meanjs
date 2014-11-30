'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('core').factory('TopShowsFactory', ['$resource',
	function($resource) {

		// Interface
		var factory = {
			getTopshows: getTopshows
		};
		return factory;

		function getTopshows() {
			return $resource('/api/topshows', {});
		}
		
	}
]);