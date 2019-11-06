const mongoose = require('mongoose');

const FilesSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	fileUrl: { type: String, required: true },
	caption: { type: String },
	fileInfo:{},
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('files', FilesSchema); 