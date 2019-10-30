'use strict'
const emailVerification = require('./accountAcivationEmail');
const attemptResetPassword = require('./attemptResetPassword');
const successResetPassword = require('./successResetPassword');
module.exports = {
    emailVerification,
    attemptResetPassword,
    successResetPassword
};