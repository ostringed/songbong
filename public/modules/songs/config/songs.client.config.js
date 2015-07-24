'use strict';

// Configuring the Articles module
angular.module('songs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Songs', 'songs', 'item', 'songs');
        Menus.addMenuItem('topbar', 'Create Song', 'songs/create', 'item', 'songs/create');
//		Menus.addSubMenuItem('topbar', 'songs', 'List Songs', 'songs');
//		Menus.addSubMenuItem('topbar', 'songs', 'New Song', 'songs/create');
	}
]);