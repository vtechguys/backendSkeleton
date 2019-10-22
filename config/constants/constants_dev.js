'use strict'
const appConstants = {
    JWT_DURATION: 86400,//env
    JWT_KEY: 'supersecret',//env 
    SESSION_TYPE: 'multiple',
    SESSION_MODE: "jwt", // express sessions were removed
    HTTP_LOGGER_TYPE: 'dev',
    REQ_URL: 'http://localhost:1234/',



// Service used to send email

    MAIL_TRANSPORT_NAME: 'SMTP',
    MAIL_TRANSPORT_SERVICE: 'Gmail',
    MAIL_TRANSPORT_AUTH_EMAIL: 'shubijha95@gmail.com',
    MAIL_TRANSPORT_AUTH_PASSWORD: 'ANIKET@123',
    MAIL_URL: 'smtp.gmail.com',

    SUPER_ADMIN_EMAIL: "aniketjha898@gmail.com",
    SUPER_ADMIN_PHONE_NUMBER: '9540700460',
    SUPER_ADMIN_PHONE_NUMBER_CODE: '+91',

// Company
    COMPANY_NAME: 'DevopsGenesis',
//  Dev email
    DEV_EMAIL_CRASH_REPORT: 'vtechguys@gmail.com',
};
module.exports = appConstants;