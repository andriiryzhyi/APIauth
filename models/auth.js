const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
	method: {
		type: String,
		enum: ['local', 'google', 'facebook'],
		required: true
	},
	local: {
		email: {
			type: String,
			lovercase: true
		},
		password: {
			type: String
		}
	},
	google: {
		id: {
			type: String
		},
		email: {
			type: String,
			lovercase: true
		}
	},
	facebook: {
		id: {
			type: String
		},
		email: {
			type: String,
			lovercase: true
		}
	}
})

userSchema.pre("save", async function(next) {
	try {
		if (this.method !== 'local') {
			next();
		}
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(this.local.password, salt);
		this.local.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.isValidPassword = async function (newPassword) {
	try {
		console.log('this.local.password', this.local.password);
		console.log('new password', newPassword);
		return await bcrypt.compare(newPassword, this.local.password);
	} catch (error) {
		throw new Error(error);
	}
}

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
