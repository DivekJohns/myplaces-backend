const express = require('express');
const router = express.Router();
const PlaceController = require('../controller/place-controller');

//Create place
router.post('/add-place', (req, res) => {
	PlaceController.createPlace(req.body).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});

//Read Place by Id
router.get('/place-info/:placeId', (req, res) => {
	PlaceController.findPlaceById(req.params.placeId).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});
//Read Place by Id
router.get('/places/:user/:searchString', (req, res) => {
	const {user, searchString} = req.params
	PlaceController.findPlaces( {user, searchString} ).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});

//get all places by user id
router.get('/places/:userId', (req, res) => {
	PlaceController.retrieveAllPlaces(req.params.userId).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});

// Update place
router.put('/update-place/:placeId', (req, res) => {
	req.body.placeId = req.params.placeId;
	PlaceController.updatePlace(req.body).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});


//Delete place
router.delete('/delete-place/:placeId', (req, res) => {
	PlaceController.deletePlace(req.params.placeId).then((data) => {
		res.status(201).send(data);
	}).catch((err) => {
		res.status(500).send(err);
	});
});


module.exports = router;