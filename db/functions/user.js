'use strict'
const { encrypt, generate } = require('../../utils');
function assignUserId(userObj) {
    const USER_ID_LENGTH = 12;
    userObj.userId = generate.randomString(USER_ID_LENGTH);
}
function encryptPassword(userObj, password) {
    const salt = encrypt.genRandomString(10);
    const passwordHash = encrypt.sha512(password, salt ).hash;
    userObj.password = passwordHash;
    userObj.salt = salt;
}


module.exports = {
   
    encryptPassword,
    
    assignUserId,
   
};