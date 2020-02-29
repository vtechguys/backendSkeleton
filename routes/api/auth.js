'use strict'

const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/Auth');

router.post('/login', AuthController.authLoginRouteHandler);
router.post('/register', AuthController.authRegisterRouteHandler);
router.post('/attempt-forgot-password', AuthController.authAttemptToForgotPasswordRouteHandler);
router.post('/reset-forgot-password', AuthController.authResetPasswordRouteHandler);
router.post('/email-verification', AuthController.authEmailVerificationRouteHandler);
// router.post('/google-signin');
// router.post('/facebook-signin')
module.exports = router; 