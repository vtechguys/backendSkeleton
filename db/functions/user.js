'use strict'
const { encrypt, generate } = require('../../utils');
const { constants } = require('../../config');

function assignUserId(userObj) {
    const USER_ID_LENGTH = 12;
    userObj.userId = generate.randomString(USER_ID_LENGTH);
}

function setEmail(userObj, email) {
    userObj.email = email;
    userObj.emailVerified = false;
}
function $_setSuperAdminEmail(userObj) {
    const email = constants.SUPER_ADMIN_EMAIL;
    setEmail(userObj, email);
}
function setEmailVerfied(userObj, status) {
    userObj.emailVerified = status;
}
function encryptPassword(userObj, password, salt) {
    const passwordHash = encrypt.sha512(password, salt).hash;
    userObj.password = passwordHash;
}
function setFirstName(userObj, firstName) {
    userObj.firstName = firstName;
}
function setPhoneNumber(userObj, phoneNo) {
    userObj.phoneNo = phoneNo;
}
function $_setPhoneNumberSuperAdmin() {
    const PHONE_NUMBER = constants.SUPER_ADMIN_PHONE_NUMBER;
    setPhoneNumber(userObj, PHONE_NUMBER);
}
function $_setMoblieCodeSuperAdmin(userObj) {
    const PHONE_MOBILE_CODE = constants.SUPER_ADMIN_PHONE_NUMBER_CODE;
    setMobileCode(userObj, PHONE_MOBILE_CODE);
}
function setMobileCode(userObj, code) {
    userObj.code = code;
}
function setPhoneNumberAndCode(userObj, phoneNo, code = "+91") {
    setPhoneNumber(userObj, phoneNo);
    setMobileCode(userObj, code);
}
module.exports = {
    $_setSuperAdminEmail,
    setEmail,
    setEmailVerfied,
    encryptPassword,
    setFirstName,
    setPhoneNumberAndCode,
    setPhoneNumber,
    setMobileCode,
    $_setPhoneNumberSuperAdmin,
    $_setMoblieCodeSuperAdmin,
    assignUserId
};