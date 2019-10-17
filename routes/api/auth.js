'use strict'

const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/Auth');

router.post('/login', AuthController.authLoginRouteHandler);
router.post('/register', AuthController.authRegisterRouteHandler);
// router.post('/register-vender', AuthController.registerVender);
// router.post('/register-driver', AuthController.registerDriver);
// router.post('/register-admin', AuthController.registerAdmin);



module.exports = router; 