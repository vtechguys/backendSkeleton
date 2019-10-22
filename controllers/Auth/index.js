'use strict'

const { loadash, validate, sendResponse, encrypt, logger } = require('../../utils');

const msg = require('./msgconfig');

const dbOperations = require('../../db/crudOperation/user');

function validateLoginInputs(body) {

    const errors = {};


    if (body.loginId) {

        if (!validate.email(body.loginId) || !validate.username(body.loginId)) {
            errors.loginId = msg.loginIdInvalid;
        }
    }
    else {
        errors.loginId = msg.loginIdRequired;
    }

    if (body.password) {
        if (!validate.password(body.password)) {
            errors.password = msg.passwordInvalid;
        }
    }
    else {
        errors.password = msg.passwordInvalid;
    }

    if (!body.rememberMe || body.rememberMe && typeof body.rememberMe !== "boolean") {
        body.rememberMe = false;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    }

}

const LOGIN_BODY = ['loginId', 'password', 'rememberMe'];
function authLoginRouteHandler(request, response) {

    const body = loadash.pick(request.body, LOGIN_BODY);

    const { isValid, errors } = validateLoginInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        dbOperations.doLogin(body, response);
    }
}

function validateRegistrationInputs(body) {

    const errors = {};

    if (body.email) {
        if (!validate.email(body.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }

    if (body.username) {
        if (!validate.username(body.username)) {
            errors.username = msg.usernameInvalid;
        }
    }
    else {
        errors.username = msg.usernameRequired;
    }
    if (body.password) {
        if (!validate.password(body.password)) {
            errors.password = msg.passwordInvalid;
        }
    }
    else {
        errors.password = msg.passwordRequired;
    }
    if (body.firstName) {
        if (!validate.name(body.firstName)) {
            errors.firstName = msg.firstNameInvalid;
        }
    }
    else {
        errors.firstName = msg.firstNameRequired;
    }
    if (body.lastName) {
        if (!validate.name(body.lastName)) {
            errors.lastName = msg.lastNameInvalid;
        }
    }
    else {
        errors.lastName = msg.lastNameRequired;
    }
    return {
        isValid: loadash.isEmpty(errors),
        errors
    };


}

const REGISTRATION_BODY = ["email", "username", "password", "firstName", "lastName"];
function authRegisterRouteHandler(request, response) {
    const body = loadash.pick(request.body, REGISTRATION_BODY);
    const { isValid, errors } = validateRegistrationInputs(request.body);
    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        dbOperations
        .register(body, response);
    }
}

module.exports = {
    authLoginRouteHandler,
    authRegisterRouteHandler
};