const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const crypto = require('crypto')

var userSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
		required: true
	},
	password: {
        type: String,
        required: true
    }
},{ timestamps: { createdAt: 'created_at' }})


userSchema.methods = {
	authenticate: async function (password){
		var isValidResult
		try {
			isValidPass = new Promise((resolve, reject) => {
				isValidResult = authPassword(this.password, password)
				resolve(isValidResult)
				})
				await isValidPass
				return isValidResult;
		  } catch (error) {
			console.log(error)
		  }
	},

	getToken: function () {
		return jwt.sign({email: this.email}, config.secret, {expiresIn: '1d'});
	}
}

async function authPassword(savedHash, passwordAttempt){
    try {
      const hashchk = await crypto
        .pbkdf2Sync(passwordAttempt, config.salt, config.iterations, 64, 'sha512')
        .toString('base64')
      return savedHash == hashchk
    } catch (error) {
      console.log(error)
    }
  }


module.exports = mongoose.model('User', userSchema);