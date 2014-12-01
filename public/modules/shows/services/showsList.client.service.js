'use strict';

// Users service used for communicating with the shows REST endpoint
angular.module('shows').service('ShowsListService', ['ShowsListFactory', '$q', '$stateParams',

	function(ShowsListFactory, $q, $stateParams) {

		this.getPaginatedShowsList = function getPaginatedShowsList(pagination) {
			var deferred = $q.defer();

			pagination = typeof pagination !== 'undefined' ? pagination : 1;

			function onGetPaginatedShowsWithSuccess(response) {
			    var shows = response;
			    deferred.resolve(shows);
			}

			ShowsListFactory.getPaginatedShows().query({pagination: pagination}).$promise.then(onGetPaginatedShowsWithSuccess, deferred.reject);

			return deferred.promise;
		};

		this.getShowById = function getShowById(id) {
		    var deferred = $q.defer();

		     function onGetShowWithSuccess(response) {
		      var show = response;
		      deferred.resolve(show);
		    }

		    ShowsListFactory.getShowsById().get({id: id}).$promise.then(onGetShowWithSuccess, deferred.reject);

		    return deferred.promise;
		};
	}
]);