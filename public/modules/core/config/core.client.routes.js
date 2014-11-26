'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html',
			resolve: {
		        topShowsFactory: function(TopShows) {
		        	console.log(TopShows);
		        	return TopShows;
		        }
		    }
		});

		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');
		// Configure html5
  		/*$locationProvider.html5Mode(true);*/
	}
]);