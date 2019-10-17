'use strict'

const express = require('express');
const router = express.Router();


const IndexController = require('../../controllers/Index');

// @route GET /
// @description sends back build front-end file index.html
// @Access Public Access
router.get('/', IndexController.indexRouteHandler);


// router.post('/webindex',(request, response)=>{

// });



module.exports = router;