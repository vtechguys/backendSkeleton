'use strict'
////////////////////////Imports///////////////////////////////

//express - routing 
const express = require('express');
//Path - pathOs
const path = require('path');
//App configurations
const config = require('../../config');

const logger = config.logger;
//////////////////////////Routes/////////////////////////////

//router
const router = express.Router();




///////////////////////File routes under "/" ////////////////




// @route GET /
// @description sends back build front-end file index.html
// @Access Public Access
router.get('/', (request, response) =>{
    logger.debug('GET /. Will send path to welcome page.');
    //base welcome path could be another server path in that case just send this path in response.sendFile(welcomePathBase)
    let welcomePathBase = config.paths.HOME_PAGE;
    //normailse path move to root cd ./../../ ie up api up routes to ~/folder-App
    let root = path.normalize( __dirname + '/../../');
    //In case welcomepage lies on our server completing the path.
    let welcomePagePathComplete = path.join( root, welcomePathBase );
    //sending the HTML file and other static files request
    response.sendFile(welcomePagePathComplete);

});


router.post('/webindex',(request, response)=>{

});



module.exports = router;