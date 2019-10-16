
const appConstants = {
    USER_ID_LENGTH:32,
    ROLE_ID_LENGTH:8,
    PASSWORD_SALT_LENGTH: 10,
    RATING_DEFAULT: 5,
    jwtDuration: 86400,//env
    jwtKey: 'supersecret',//env 
    sessionType: 'multiple',
    ALL_ROLES: ['superadmin','admin','teacher','student','guest'],
    SESSION_MODE: "jwt"
};
module.exports = appConstants;