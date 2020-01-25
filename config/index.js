'use strict'

const pathsConfig = require('./paths');
const dbConfig = require('./db');
const schemaNames = require('./schemaNames');
const constants = require('./constants');



let DB_URL = 'mongodb://localhost:27017/backednappskeleton';

if(process.env.NODE_ENV == 'production'){
   //DB_TYPE://DB_USERNAME:DB_PASSWORD@DB_BASE_URL:DB_PORT/DB_NAME

   DB_URL = 
            dbConfig.DB_TYPE + 
                '://' + 
            dbConfig.DB_USERNAME + 
                ':' + 
            dbConfig.DB_PASSWORD + 
                '@' + 
            dbConfig.DB_BASE_URL + 
                ':' + 
            dbConfig.DB_PORT + 
                '/' + 
            dbConfig.DB_NAME; 
}



const configIndex = {
    paths: pathsConfig,
    schemaNames: schemaNames,
    constants: constants,
    DB_URL: DB_URL,
    APP_VERSION: process.env.APP_VERSION || 'v1'
};

module.exports = configIndex;