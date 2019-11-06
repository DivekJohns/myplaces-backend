const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
	name: { type: String, required: true },
	address: { type: String },
	description: { type: String },
	images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'files', required: true }],
	isDeleted:{ type: Boolean, default: false},
	createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('place', PlaceSchema);