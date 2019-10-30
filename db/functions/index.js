'use strict'
const { encrypt, generate } = require('../../utils');
function assignRoleId(roleObj) {
    const ROLE_ID_LENGTH = 8;
    const { generate } = require('../../utils');

    roleObj.roleId = generate.randomString(ROLE_ID_LENGTH);
}
function assignRole(roleObj, role) {
    roleObj.role = role;
}
function createTheRole(role = "guest"){
    const roleObj = {};
    assignRoleId(roleObj);
    assignRole(roleObj, role);
    return roleObj;
}
function assignUserId(userObj) {
    const USER_ID_LENGTH = 12;
    const { generate } = require('../../utils');

    userObj.userId = generate.randomString(USER_ID_LENGTH);
}
function encryptPassword(userObj, password) {
    const salt = encrypt.genRandomString(10);
    const passwordHash = encrypt.sha512(password, salt ).hash;
    userObj.password = passwordHash;
    userObj.salt = salt;
    return userObj;
}
module.exports = {
    assignRoleId,
    assignRole,
    createTheRole,
    encryptPassword,
    
    assignUserId,
};