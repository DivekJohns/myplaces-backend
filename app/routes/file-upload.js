const express = require('express');
const router = express.Router();
const multer = require('multer');
const Files = require('../models/file-model');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = { message: 'Invalid mime type' };
		if (isValid) {
			error = null;
		}
		cb(error, './public/images');
	},
	filename: (req, file, cb) => {
		const name = file.originalname
			.toLowerCase()
			.split(' ')
			.join('-');
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, name + '-' + Date.now() + '.' + ext);
	}
});

let upload = multer({ storage: storage });

router.post('/upload', upload.array('files', 10), (req, res) => {
	if (req.files.length > 0) {
		const { placeId, userId, caption } = req.body;
		const bulkAdd = [];
		const { UPLOAD_DIR_IMAGES } = process.env;
		req.files.forEach(fileInfo => {
			const file = {
				placeId,
				userId,
				caption,
				fileUrl: req.protocol + '://' + req.hostname + UPLOAD_DIR_IMAGES + fileInfo.filename,
				fileInfo,
			};
			bulkAdd.push(file);
		});
		Files.insertMany(bulkAdd)
			.then((fileInfos)=> {
				res.send(fileInfos);
			})
			.catch( (_err)=> {
				console.log('could not save file info  in db');
				res.status(400).send(bulkAdd);
			});
	} else {
		res.status(400).send({ message: 'No file where uploaded' });
	}
});

module.exports = router;