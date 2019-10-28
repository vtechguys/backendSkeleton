'use strict'

const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/Auth');

router.post('/login', AuthController.authLoginRouteHandler);
router.post('/register', AuthController.authRegisterRouteHandler);
router.post('/forgot-password', AuthController.authAttemptToForgotPasswordRouteHandler);
router.post('/reset-forgot-password', AuthController.authResetPasswordRouteHandler);

module.exports = router; 