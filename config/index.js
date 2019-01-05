'use strict'


///////////////////////////////Imports////////////////////////////////

//paths configurations to complete app.
const pathsConfig = require('./paths');
//db config
const dbConfig = require('./db');




//////////////////////////Build configs////////////////////////////

//DB_TYPE://DB_USERNAME:DB_PASSWORD@DB_BASE_URL:DB_PORT/DB_NAME

// const DB_URL = dbConfig.DB_TYPE + '://' + dbConfig.DB_USERNAME + ':' + dbConfig.DB_PASSWORD + '@' + dbConfig.DB_BASE_URL + ':' + dbConfig.DB_PORT + '/' + dbConfig.DB_NAME;
const DB_URL = 'mongodb://localhost:27017/backednappskeleton'; //--->comment in production





//////////////////////Exporting final configs////////////////////////
const configIndex = {

    paths: pathsConfig,
    


    //session
    SESSION_MODE: 'jwt',
    //DB_URL
    DB_URL: DB_URL

};

module.exports = configIndex;