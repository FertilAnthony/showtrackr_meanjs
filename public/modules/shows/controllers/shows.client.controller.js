'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ShowsListService',
	function($scope, $stateParams, $location, Authentication, ShowsListService) {

		var vm = this;
		vm.authentication = Authentication;

		// Get paginated list of shows
		vm.getPaginatedShows = function() {
			ShowsListService.getPaginatedShowsList($stateParams.pagination).then(function(shows) {
				console.log(shows);
				vm.shows = shows;
			});

			// Configure pagination
			vm.currentPage = $stateParams.pagination;
			vm.totalItems = 9768;
		};

		vm.pageChanged = function() {
			$location.path('shows/page/' + vm.currentPage);
		};

		// Get show detail
		vm.getShowDetail = function() {
			ShowsListService.getShowById($stateParams.id).then(function(show) {
				console.log(show);
				vm.show = show;
			});
		};

		// Test if user already subscribe to show
		vm.isSubscribed = function(showId) {
			return vm.authentication.user.subscribeShows.indexOf(showId) !== -1;
		};

		// Add show to favorites
		vm.subscribeShow = function(showId) {
			ShowsListService.subscribeShow(showId).then(function(response) {
				console.log(response);
			});
		};

		vm.unsubscribeShow = function(showId) {
			ShowsListService.unsubscribeShow(showId).then(function(response) {
				console.log(response);
			});
		};

		// Create new Show
		/*$scope.create = function() {
			// Create new Show object
			var show = new Shows ({
				name: this.name
			});

			// Redirect after save
			show.$save(function(response) {
				$location.path('shows/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		// Remove existing Show
		/*$scope.remove = function(show) {
			if ( show ) { 
				show.$remove();

				for (var i in $scope.shows) {
					if ($scope.shows [i] === show) {
						$scope.shows.splice(i, 1);
					}
				}
			} else {
				$scope.show.$remove(function() {
					$location.path('shows');
				});
			}
		};*/

		// Update existing Show
		/*$scope.update = function() {
			var show = $scope.show;

			show.$update(function() {
				$location.path('shows/' + show._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};*/

		// Find a list of Shows
		/*$scope.find = function() {
			$scope.shows = Shows.query();
		};*/

		// Find existing Show
		/*$scope.findOne = function() {
			$scope.show = Shows.get({ 
				showId: $stateParams.showId
			});
		};*/
	}
]);