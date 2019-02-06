'use strict'

///////////////////////////Utility for Application////////////////////////

//encryption util
const encryptUtil = require('./encrypt');
//Mailer 


//generate
const generate = require('./generator');

//validate
const validate = require('./validate');


const utils = {
    encrypt: encryptUtil,
    generate: generate,
    validate: validate
};
module.exports = utils;