'use strict'
const appConstants = {
    JWT_DURATION: 86400,//env
    JWT_KEY: 'supersecret',//env 
    SESSION_TYPE: 'multiple',
    SESSION_MODE: "jwt", // express sessions were removed
    HTTP_LOGGER_TYPE: 'dev'
};
module.exports = appConstants;