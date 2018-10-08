const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const { JWT_SECRET } = require('./config');
const User = require('./models/auth');

// JSON WEB TOKEN STRATEGY

passport.use( new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: JWT_SECRET
}, async (payload, done) => {
	console.log('payload', payload);
	try {
		// Find the user specified in token
		const user = await User.findById(payload.sub);
		// If user doesn't exists, handle it
		if (!user) {
			return done(null, false);
		}
		// Otherwise return the user
		return done(null, user);
	} catch (error) {
		done(error, false);
	}
}));

// LOCAL STRATEGY

passport.use( new LocalStrategy({
	usernameField: 'email'
}, async (email, password, done) => {
	// Find the user given the email
	const user = await User.findOne({ email });
	
	// Is not, handle it
	if (!user) {
		return done(null, false);
	}

	// Check if is the password is correct

	// If not, handle it

	// Otherwise return the user
}));