'use strict';

// Shows controller
angular.module('shows').controller('ShowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PaginatedShows',
	function($scope, $stateParams, $location, Authentication, PaginatedShows) {

		var vm = this;
		$scope.authentication = Authentication;

		// Get paginated list of shows
		PaginatedShows.then(function(shows) {
			vm.shows = shows;
		});

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