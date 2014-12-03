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

		this.getSearchShows = function getSearchShows(search) {
		    var deferred = $q.defer();

		     function onGetSearchShowsWithSuccess(response) {
		      var shows = response;
		      deferred.resolve(shows);
		    }

		    ShowsListFactory.getSearchShows().query({search: search}).$promise.then(onGetSearchShowsWithSuccess, deferred.reject);

		    return deferred.promise;
		};

		this.subscribeShow = function subscribeShow(showId) {
			var deferred = $q.defer();

		     function onSubscribeShowWithSuccess(response) {
		      deferred.resolve(response);
		    }

		    ShowsListFactory.subscribeShow().save({showId: showId}).$promise.then(onSubscribeShowWithSuccess, deferred.reject);

		    return deferred.promise;
		};

		this.unsubscribeShow = function subscribeShow(showId) {
			var deferred = $q.defer();

		     function onUnsubscribeShowWithSuccess(response) {
		      deferred.resolve(response);
		    }

		    ShowsListFactory.unsubscribeShow().save({showId: showId}).$promise.then(onUnsubscribeShowWithSuccess, deferred.reject);

		    return deferred.promise;
		};
	}
]);