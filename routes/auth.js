const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const {validateBody, schemas} = require('../helpers/routeHelpers');
const AuthController = require('../controllers/auth');
const passportConfig = require('../passport.js');

router.route('/sign-up')
	.post(validateBody(schemas.authSchema), AuthController.signUp);

router.route('/sign-in')
	.post(AuthController.signIn);

router.route('/secret')
	.get(passport.authenticate('jwt', {session: false}), AuthController.secret);

module.exports = router;