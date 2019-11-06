const User = require('../../models/client/user-model');
const bcrypt = require('bcrypt');

module.exports = class UserController {
	static async createUser(creteUserData) {
		return new Promise((resolve, reject) => {
			User.findOne({ 'email': creteUserData.email })
				.then((email) => {
					if (email) {
						return reject(({ message: 'This email address is already registered' }));
					} else {
						let passwordHash = creteUserData.password;
						const { name,email } = creteUserData;
						if (!passwordHash || !email || !name) {
							return reject({ message: 'invalid data you passed empty field required name email and password :(' });
						}
						passwordHash = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(8));

						const user = new User({
							'email': creteUserData.email,
							'name': creteUserData.name,
							'password': passwordHash,
							'image':creteUserData.image
						});
						return user.save().then((user)=>{
							delete	user._doc.password;
							resolve({ user: user._doc }, { message: 'successfully created a user :)' });
						});
					}
				})
				.catch(err => {
					return reject({ err }, { message: 'Unable to create user :(' });
				});
		});
	}
	static updateUser(updateRequestObject) {
		//Only pass necessary fields that needs to update
		return new Promise((resolve, reject) => {
			User.findById(updateRequestObject.userId).then((user) => {
				if (!user) {
					reject({ message: 'user not found please create and update :(' });
				} else {
					if (updateRequestObject.password) {
						let passwordHash  = bcrypt.hashSync(updateRequestObject.password, bcrypt.genSaltSync(8));
						updateRequestObject.password = passwordHash;
					}
					//todo deprecated!!
					return User.findOneAndUpdate({
						_id: updateRequestObject.userId
					}, {
						$set: updateRequestObject
					}, { new: true,   fields: { password: 0},});
				}
			}).then((result) => {
				resolve({
					updated: result,
					message: 'updated successfully :)'
				});
			})
				.catch((err) => {
					err.desc = 'Unable to update check user id and try again :(';
					reject(err);
				});
		});
	}

	static findUserById(userId) {
		return new Promise((resolve, reject) => {
			User.findById(userId)
				.then((user) => {
					if (user) {
						delete	user._doc.password;
						resolve({ user:user._doc }, { message: 'Successfully retrieved user info' });
					} else {
						reject({ message: 'Unable to retrieve user information no user found :(' });
					}
				}).catch((error) => {
					reject(error);
				});
		});
	}

	static deleteUser(userId) {
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate({ _id: userId }, { isBlocked: true })
				.then(() => {
					resolve({ message: 'Successfully deleted user :)' });
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
};

