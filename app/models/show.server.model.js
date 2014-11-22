'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Show Schema
 */
var ShowSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Show name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	airsDayOfWeek: String,
	airsTime: String,
	firstAired: Date,
	genre: [String],
	network: String,
	overview: String,
	rating: Number,
	ratingCount: Number,
	status: String,
	poster: String,
	subscribers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	episodes: [{
		season: Number,
		episodeNumber: Number,
		episodeName: String,
		firstAired: Date,
		overview: String
	}]
});

mongoose.model('Show', ShowSchema);