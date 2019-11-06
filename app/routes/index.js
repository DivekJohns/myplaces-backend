const userRoutes = require('../routes/client/user-route');
const accountRoutes = require('./client/account');
const placeRoutes = require('./place-route');
const fileUpload = require('./file-upload');

module.exports = (app) => {
	app.use(process.env.APIVERSION, 
		userRoutes,
		accountRoutes,
		placeRoutes,
		fileUpload);
};