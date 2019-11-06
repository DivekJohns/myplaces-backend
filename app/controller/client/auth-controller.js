const User = require('../../models/client/user-model');
const jwt = require('jsonwebtoken');

module.exports = class AccountController {
	static userLogin(loginRequest) {
		return new Promise((resolve, reject) => {
			User.getAuthenticated(loginRequest.email, loginRequest.password, (err, user, reason) => {
				if (err) return reject(err);
				if (user) {
					const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_KEY, {
						expiresIn: process.env.PASSWORD_EXPIRY_HR
					});
					delete	user._doc.password;
					resolve({ token: token, user:user._doc});
				} else {
					var reasons = User.failedLogin;
					switch (reason) {
					case reasons.NOT_FOUND:
						reject({ message: 'User not found' });
						break;
					case reasons.PASSWORD_INCORRECT:
						reject({ message: 'Password was incorrect' });
						break;
					case reasons.PASSWORD_INVALID:
						reject({ message: 'Password was Invalid' });
						break;
					case reasons.USER_BLOCKED:
						reject({ message: 'user is blocked or deleted' });
						break;
					default:
						reject({ message: 'Unknown exception' });
					}
				}
			});
		});
	}
};

