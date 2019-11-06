/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	name: { type: String},
	password: { type: String },
	image: { type: String },
	isBlocked: {type: Boolean, default: false}
});
	
userSchema.methods.comparePassword = (candidatePassword,userPassword, cb)=> {
	bcrypt.compare(candidatePassword, userPassword, (err, isMatch) =>{
		if (err) return cb(err,false);
		cb(null, isMatch);
	});
};
	
// expose enum on the model, and provide an internal convenience reference 
var reasons = userSchema.statics.failedLogin = {	
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	PASSWORD_INVALID:2,
	USER_BLOCKED:3,
};
	
userSchema.statics.getAuthenticated = (email, password, cb)=> {
	User.findOne({ 'email': email }, (err, user)=> {
		if (err) return cb(err);
	
		// make sure the user exists
		if (!user) {
			return cb(null,null, reasons.NOT_FOUND);
		}
		//if password null
		if(!password){
			return cb(null, null,reasons.PASSWORD_INVALID);
		}

		if(user.isBlocked){
			return cb(null, null,reasons.USER_BLOCKED);
		}



		// test for a matching password
		user.comparePassword(password, user.password,(err, isMatch) => {
			if (err) return cb(err);
			// check if the password was a match
			if (isMatch) {
				return cb(null ,user);
			}
			return cb(null ,null,reasons.PASSWORD_INCORRECT);
		});
	});
};
const User =  mongoose.model('user', userSchema);
module.exports = User; 