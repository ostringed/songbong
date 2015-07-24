'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Song Schema
 */
var SongSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Song name',
		trim: true
	},
    link: {
        type: String,
        default: '',
        required: 'Please fill Song URL/Link',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Song', SongSchema);