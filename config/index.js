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


    //session
    SESSION_MODE: 'jwt',
    //DB_URL
    DB_URL: DB_URL,
    //LOGGER CONFIG
    LOGGER_TYPE: 'dev',
    //Email used by superAdmin
    SUPER_ADMIN_EMAIL: 'aniketjha898@gmail.com'

};

module.exports = configIndex;