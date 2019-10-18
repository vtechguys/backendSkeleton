'use strict'
const { encrypt, generate } = require('../../utils');
function assignRoleId(roleObj) {
    roleObj.roleId = generate.randomString(8);
}
function assignRole(roleObj, role) {
    roleObj.role = role;
}
function createTheRole(role = "guest"){
    const roleObj = {};
    assignRoleId(roleObj);
    assignRole(role);
}
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
    assignRoleId,
    assignRole,
    createTheRole,
    encryptPassword,
    
    assignUserId,
};