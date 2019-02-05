'use strict'

///////////////////////////Utility for Application////////////////////////

//encryption util
const encryptUtil = require('./encrypt');
//Mailer 


//generate
const generate = require('./generator');



const utils = {
    encrypt: encryptUtil,
    generate: generate
};
module.exports = utils;