'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('core').service('TopShows', ['TopShowsFactory', '$q', '$log',

	function(TopShowsFactory, $q, $log) {
		var deferred = $q.defer();

		function onGetTopShowsWithSuccess(response) {
		    var shows = response;
			$log.log(shows);
		    deferred.resolve(shows);
		}

		TopShowsFactory.query().$promise.then(onGetTopShowsWithSuccess, deferred.reject);

		return deferred.promise;
	}
]);