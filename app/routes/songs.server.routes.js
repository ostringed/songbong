'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var songs = require('../../app/controllers/songs.server.controller');

	// Songs Routes
	app.route('/songs')
		.get(songs.list)
		.post(users.requiresLogin, songs.create);

	app.route('/songs/:songId')
		.get(songs.read)
		.put(users.requiresLogin, songs.hasAuthorization, songs.update)
		.delete(users.requiresLogin, songs.hasAuthorization, songs.delete);

	// Finish by binding the Song middleware
	app.param('songId', songs.songByID);
};
