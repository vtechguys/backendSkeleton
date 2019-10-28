'use strict'
const appConstants = {
    JWT_DURATION: 86400,//env
    JWT_KEY: 'supersecret',//env 
    SESSION_TYPE: 'multiple',
    SESSION_MODE: "jwt", // express sessions were removed
    HTTP_LOGGER_TYPE: 'dev',



    // Service used to send email

    MAIL_TRANSPORT_NAME: 'SMTP',
    MAIL_TRANSPORT_SERVICE: 'Gmail',
    MAIL_TRANSPORT_AUTH_EMAIL: 'email@gmail.com',
    MAIL_TRANSPORT_AUTH_PASSWORD: 'emailpass',

    SUPER_ADMIN_EMAIL: "sa.email@gmail.com",
    SUPER_ADMIN_PHONE_NUMBER: '9876543210',
    SUPER_ADMIN_PHONE_NUMBER_CODE: '+91',

    // Company
    COMPANY_NAME: 'DevopsGenesis',
    //  Dev email
    DEV_EMAIL_CRASH_REPORT: 'devcrash@gmail.com',
};
module.exports = appConstants;