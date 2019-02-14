'use strict'

///////////////////////////Utility for Application////////////////////////

//encryption util
const encryptUtil = require('./encrypt');
//Mailer 


//generate
const generate = require('./generator');

//validate
const validate = require('./validate');
//mailer
const mailer = require('./mailer');
//loadash
const loadash = require('./lodash');
const utils = {
    encrypt: encryptUtil,
    generate: generate,
    validate: validate,
    mailer: mailer,
    loadash: loadash
};
module.exports = utils;