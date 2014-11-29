'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('shows').service('PaginatedShows', ['PaginatedShowsFactory', '$q', '$stateParams',

	function(PaginatedShowsFactory, $q, $stateParams) {
		var deferred = $q.defer(),
			pagination = typeof $stateParams.pagination !== 'undefined' ? $stateParams.pagination : 1;

		function onGetPaginatedShowsWithSuccess(response) {
		    var shows = response;
		    deferred.resolve(shows);
		}

		PaginatedShowsFactory.query({pagination: pagination}).$promise.then(onGetPaginatedShowsWithSuccess, deferred.reject);

		return deferred.promise;
	}
]);