'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'TopShows', '$log',
	function($scope, Authentication, TopShows, $log) {
$log.log(TopShows.getTopShows());
		var vm = this;

		// This provides Authentication context.
		$scope.authentication = Authentication;

		vm.shows = [];

		// call resolve route
		//vm.shows = TopShows.getTopShows();
	}
]);