'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('core').service('TopShows', ['TopShowsFactory', '$q', '$log',

	function(TopShowsFactory, $q, $log) {

		this.getTopShowsList = function getTopShowsList() {
			var deferred = $q.defer();

			function onGetTopShowsWithSuccess(response) {
				var shows = response;
				deferred.resolve(shows);
			}

			TopShowsFactory.getTopshows().query().$promise.then(onGetTopShowsWithSuccess, deferred.reject);

			return deferred.promise;
		};
	}
]);