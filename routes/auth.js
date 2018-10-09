const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const {validateBody, schemas} = require('../helpers/routeHelpers');
const AuthController = require('../controllers/auth');
const passportConfig = require('../passport.js');

const passportSignIn = passport.authenticate('local', {session: false});
const passportJWT = passport.authenticate('jwt', {session: false});

router.route('/sign-up')
	.post(validateBody(schemas.authSchema), AuthController.signUp);

router.route('/sign-in')
	.post(validateBody(schemas.authSchema), passportSignIn, AuthController.signIn);

router.route('/secret')
	.get(passportJWT, AuthController.secret);

module.exports = router;