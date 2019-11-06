const Place = require('../models/place-model');
const id = require('mongodb').ObjectID;

module.exports = class PlaceController {
	static async createPlace(cretePlaceData) {
		return new Promise((resolve, reject) => {
			Place.find({ 'name': cretePlaceData.name, 'user': cretePlaceData.user, isDeleted: false })
				.then((places) => {
					if (places.length > 0) {
						return reject(({ message: 'This place name is already in use' }));
					} else {
						const place = new Place(cretePlaceData);
						return place.save();
					}
				})
				.then(async (place) => {
					if (place) {
						const placeInfo = await this.findPlaceById(place._id);
						return resolve({ place : placeInfo.place, message: 'successfully created a Place ' });
					}else {
						throw new Error('unknown error');
					}
				})
				.catch(err => {
					return reject({ err }, { message: 'Unable to create Place' });
				});
		});
	}
	static updatePlace(updateRequestObject) {
		//Only pass necessary fields that needs to update, same route can be used to empty array
		return new Promise(async (resolve, reject) => {
			if (updateRequestObject.name) {
				const places = await Place.find({ name : updateRequestObject.name });
				if (places.length > 1) {
					return reject({ message: 'Place name is already taken try another name:(' });
				}
			}
			let pushItems = {};
			let setItems = {};
			//dynamically assign object and array items
			for (const [key, value] of Object.entries(updateRequestObject)) {
				if (Array.isArray(updateRequestObject[key])) {
					pushItems[key] = value;
				} else {
					setItems[key] = value;
				}
			}

			Place.findOneAndUpdate({
				_id: setItems.placeId
			}, {
				$set: setItems,
				$push: pushItems
			}, { new: true }).populate('images').then((result) => {
				resolve({
					updated: result,
					message: 'updated your place successfully'
				});
			})
				.catch((err) => {
					err.desc = 'Unable to update check Place id and try again :(';
					reject(err);
				});
		});
	}

	static findPlaceById(placeId) {
		return new Promise((resolve, reject) => {
			Place.findById(placeId).populate('images').then((placeInfo) => {
				if (placeInfo) {
					resolve({
						place: placeInfo,
					});
				} else {
					reject({ message: 'Unable to return Place information no Place found :(' });
				}
			}).catch((error) => {
				reject(error);
			});
		});
	}
	static findPlaces({user,searchString}) {
		return new Promise((resolve, reject) => {
			Place.find({user: id(user), name: new RegExp(searchString)}).then((placeInfo) => {
				if (placeInfo) {
					resolve({
						places: placeInfo,
					});
				} else {
					reject({ message: 'Unable to return Place information no Place found :(' });
				}
			}).catch((error) => {
				reject(error);
			});
		});
	}
	static retrieveAllPlaces(userId) {
		return new Promise((resolve, reject) => {
			Place.find({ user: id(userId), isDeleted: false }).populate('images')
				.then((places) => {
					if (places.length > 0) {
						resolve({ places }, { message: 'Successfully retrieved all places information' });
					} else {
						reject({ message: 'you have no places :(' });
					}
				}).catch((error) => {
					reject(error);
				});
		});
	}

	static deletePlace(PlaceId) {
		return new Promise((resolve, reject) => {
			Place.findOneAndUpdate({ _id: PlaceId }, { isDeleted: true })
				.then(() => {
					resolve({ message: 'Successfully deleted Place' });
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
};