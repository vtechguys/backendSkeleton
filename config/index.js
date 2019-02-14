'use strict'


///////////////////////////////Imports////////////////////////////////

//paths configurations to complete app.
const pathsConfig = require('./paths');
//db config
const dbConfig = require('./db');
//Logger
const loggerConfig = require('./logger');
//response types 
const responseTypesConfig = require('./responseTypes');
//schemaNames
const schemaNames = require('./schemaNames');
//appConstants
const constants = require('./appConstants/index.js');

//////////////////////////Build configs////////////////////////////

//DB_TYPE://DB_USERNAME:DB_PASSWORD@DB_BASE_URL:DB_PORT/DB_NAME

// const DB_URL = dbConfig.DB_TYPE + '://' + dbConfig.DB_USERNAME + ':' + dbConfig.DB_PASSWORD + '@' + dbConfig.DB_BASE_URL + ':' + dbConfig.DB_PORT + '/' + dbConfig.DB_NAME;
const DB_URL = 'mongodb://localhost:27017/backednappskeleton'; //--->comment in production





//////////////////////Exporting final configs////////////////////////
const configIndex = {
    HOME_PAGE:'/public/build/index.html',

    paths: pathsConfig,
    logger: loggerConfig,
    responseTypes: responseTypesConfig,
    schemaNames: schemaNames,
    constants: constants,

    //session
    SESSION_MODE: 'jwt',
    //DB_URL
    DB_URL: DB_URL,
    //LOGGER CONFIG
    LOGGER_TYPE: 'dev',
    //Email used by superAdmin
    SUPER_ADMIN_EMAIL: 'aniketjha898@gmail.com',
    MOBILE_NO: '9540700460',
    REQ_URL:'http://localhost:5500',
    SMTP_EMAIL: 'dev.devopsgenesis@gmail.com',
    SMTP_PASSWORD: 'Ytrewq.12345',
    SMTP_SERVICE_URL: 'smtp.gmail.com'

};

module.exports = configIndex;