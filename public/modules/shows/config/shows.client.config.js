'use strict';

// Configuring the Articles module
angular.module('shows').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Shows', 'shows', 'dropdown', '/shows(/create)?');
		Menus.addMenuItem('topbar', 'TV Shows', 'listShows({ pagination: 1 })', 'listShows');
		//Menus.addSubMenuItem('topbar', 'shows', 'New Show', 'shows/create');
	}
]);