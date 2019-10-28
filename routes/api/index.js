'use strict'

const express = require('express');
const router = express.Router();


const IndexController = require('../../controllers/Index');

router.get('/', IndexController.indexRouteHandler);

router.post('/web-index', IndexController.indexWebIndexRouteHandler);



module.exports = router;