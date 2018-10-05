const express = require('express');
const router = require('express-promise-router')();
const AuthController = require('../controllers/auth')

router.route('/sign-up')
	.post(AuthController.signUp);

router.route('/sign-in')
	.post(AuthController.signIn);

router.route('/secret')
	.get(AuthController.secret);

module.exports = router;