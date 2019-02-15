'use strict'

const express = require('express');
const router = express.Router();

const AuthController = require('../../controllers/Auth');
// const RoleMiddleWare = require('../../middleware/role');

router.post('/login', AuthController.login);

router.post('/register-vender', AuthController.registerVender);
router.post('/register-driver', AuthController.registerDriver);
router.post('/register-admin', AuthController.registerAdmin);



module.exports = routesController; 