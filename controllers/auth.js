const User = require('../models/auth');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

signToken = user => {
	return JWT.sign({
		iss: 'SomeString',
		sub: user.id,
		iat: new Date().getTime(), // current date
		exp: new Date(new Date().getTime() + 24 *60 * 60 * 1000).getTime() // current date + 1 day
	}, JWT_SECRET);
}

module.exports = {
	signUp: async (req, res, next) => {
		console.log('signUp', req.value.body);
		
		const {email, password} = req.value.body;
		// check is the user
		const foundUser = await User.findOne({'local.email': email});
		if (foundUser) {
			return res.status('403').json({error: 'Email is already exists'});
		}

		// create a new user
		const newUser = new User({
			method: 'local',
			local: {
				email: email, 
				password: password
			}
		});
		await newUser.save();
		
		const token = signToken(newUser);

		// respond with token
		res.status(200).json({token});
	},

	signIn: async (req, res, next) => {
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	googleOAuth: async (req, res, next) => {
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	facebookOAuth: async (req, res, next) => {
		const token = signToken(req.user);
		res.status(200).json({ token });
	},

	secret: async (req, res, next) => {
		console.log('secret');
		res.json({secret: 'resource'});
	}
}