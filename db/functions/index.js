'use strict'
const { encrypt, generate } = require('../../utils');
function uniqueIdGenerator(length = 8){
    return generate.randomString(length);
}
function createTheRole(role = 'guest'){
    const roleObj = {};
    const ROLE_ID_LENGTH = 8;

    roleObj.roleId = uniqueIdGenerator(ROLE_ID_LENGTH);
    roleObj.role = role;
    return roleObj;
}
function generateUserId() {
    const USER_ID_LENGTH = 12;
    return uniqueIdGenerator(USER_ID_LENGTH);
}
function encryptedPasswordAndHash(password) {
    const salt = encrypt.genRandomString(10);
    const hash = encrypt.sha512(password, salt ).hash;
    return {
        hash,
        salt
    };
}
module.exports = {
    assignRoleId,
    assignRole,
    createTheRole,
    encryptedPasswordAndHash,
    
    generateUserId,
};