'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('core').service('TopShows', ['TopShowsFactory', '$q',

	function(TopShowsFactory, $q) {
		var deferred = $q.defer();

		function onGetTopShowsWithSuccess(response) {
		    var shows = response;
		    deferred.resolve(shows);
		}

		TopShowsFactory.query().$promise.then(onGetTopShowsWithSuccess, deferred.reject);

		return deferred.promise;
	}
]);