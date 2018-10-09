const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lovercase: true
	},
	password: {
		type: String,
		required: true
	}
})

userSchema.pre("save", async function(next) {
	console.log('THIS', this);
	try {
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(this.password, salt);
		console.log('salt', salt);
		console.log('password', this.password, 'password hash', passwordHash);
		this.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.isValidPassword = async function (newPassword) {
	try {
		return await bcrypt.compare(newPassword, this.password);
	} catch (error) {
		throw new Error(error);
	}
}

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
