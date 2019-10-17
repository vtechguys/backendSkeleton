
const appConstants = {
    USER_ID_LENGTH: 32,
    ROLE_ID_LENGTH: 8,
    PASSWORD_SALT_LENGTH: 10,

    RATING_DEFAULT: 5,
    JWT_DURATION: 86400,//env
    JWT_KEY: 'supersecret',//env 
    SESSION_TYPE: 'multiple',
    ALL_ROLES: ['superadmin','admin','teacher','student','guest'],
    SESSION_MODE: "jwt",

    
};
module.exports = appConstants;