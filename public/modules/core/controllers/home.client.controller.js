'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'topShowsFactory', '$log',
	function($scope, Authentication, topShowsFactory, $log) {
$log.log('test');
		var vm = this;

		// This provides Authentication context.
		$scope.authentication = Authentication;

		vm.shows = [];

		// call resolve route
		vm.shows = topShowsFactory;
		$log.log(vm.shows);
	}
]);