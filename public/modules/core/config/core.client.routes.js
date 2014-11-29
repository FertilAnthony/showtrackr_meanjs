'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');
		// Configure html5
  		$locationProvider.html5Mode(true);
	}
]);