const User = require('../models/auth');

module.exports = {
	signUp: async (req, res, next) => {
		console.log('signUp', req.value.body);
		
		const {email, password} = req.value.body;
		// check is the user
		const foundUser = User.findOne({email});
		if (foundUser) {
			return res.status('403').json({error: 'Email is already exists'});
		}

		// create a new user
		const newUser = new User({email, password});
		await newUser.save();
		
		// respond with token
		res.json({user: 'created'});
	},

	signIn: async (req, res, next) => {
		console.log('signIn');
	},

	secret: async (req, res, next) => {
		console.log('secret');
	}
}