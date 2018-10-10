const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('./config');
const User = require('./models/auth');

// GOOGLE OAUTH STRATEGY

passport.use('googleToken', new GooglePlusTokenStrategy({
	clientID: 'clientID',
	clientSecret: 'secret'
}, async (accessToken, refreshToken, profile, done) => {
	try {
		console.log('accessToken', accessToken);
		console.log('refreshToken', refreshToken);
		console.log('profile', profile);

		// Check  if this.current user exists in DB
		const existingUser = await User.findOne({ 'google.id': profile.id });
		if (existingUser) {
			console.log('User already exists in DB', );
			return done(null, existingUser);
		}

		console.log('User doesn\'t exists in DB', );

		// If new account
		const newUser = new User({
			method: 'google',
			google: {
				id: profile.id,
				email: profile.emails[0].value
			}
		});

		await newUser.save();
		done(null, newUser);	
	} catch (error) {
		done(error, false, error.message);
	}
}));

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
	try {
		console.log('email', email);
		// Find the user given the email
		const user = await User.findOne({ "local.email": email });
		
		// Is not, handle it
		if (!user) {
			return done(null, false);
		}

		// Check if is the password is correct
		const isMatch = await user.isValidPassword(password);

		console.log('isMatch', isMatch);
		
		// If not, handle it
		if (!isMatch) {
			return done(null, false);
		}

		// Otherwise return the user
		done(null, user);
	} catch (error) {
		done(error, false);
	}
}));