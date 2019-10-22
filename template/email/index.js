'use strict'
const accountActivationEmail = require('./accountAcivationEmail');
const attemptResetPassword = require('./attemptResetPassword');
const successResetPassword = require('./successResetPassword');
module.exports = {
    accountActivationEmail,
    attemptResetPassword,
    successResetPassword
};