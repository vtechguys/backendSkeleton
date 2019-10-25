'use strict'

const { loadash, validate, sendResponse, encrypt, logger, sms, mailer } = require('../../utils');

const msg = require('./msgconfig');

const dbOperations = require('../../db/crudOperation/user');


const EXPIRATION_DURATION = 5 * 60 * 1000;


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

function authLoginRouteHandler(request, response) {
    const LOGIN_BODY = ['loginId', 'password', 'rememberMe'];

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
    if (body.confirmPassword) {

        if (!validate.confirmPassword(body.confirmPassword)) {
            errors.confirmPassword = msg.confirmPasswordInvalid;

        }

    }
    else {
        errors.confirmPassword = msg.confirmPasswordInvalidRequired;
    }
    if (body.password && body.confirmPassword && body.password === body.confirmPassword) {
        errors.confirmPassword = msg.pAndCpMismatch;
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

function authRegisterRouteHandler(request, response) {
    const REGISTRATION_BODY = ["email", "username", "password", "firstName", "lastName", "confirmPassword"];

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

function validateAttemptToForgotPasswordInputs(info) {
    const VALID_MEDIA = ["email", "mobile"];

    if (info.email) {
        if (!validate.email(info.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }

    if (VALID_MEDIA.indexOf(info.media) == -1) {
        errors.media = msg.mediaNotSupported;
    }



    return {
        isValid: loadash.isEmpty(errors),
        errors
    };
}

function authAttemptToForgotPasswordRouteHandler(request, response) {
    logger.debug("authAttemptToForgotPassword");
    const ATTEMPT_RESET_PASSWORD = ["email", "media"];

    const body = loadash.pick(request.body, ATTEMPT_RESET_PASSWORD);


    const { isValid, errors } = validateAttemptToForgotPasswordInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        dbOperations.addPasswordToken(body.email, function addPasswordTokenCbRoute(error, result) {
            if (error) {
                sendResponse.serverError(response);
            }
            else {
                if (!result) {
                    sendResponse.notFound(response, msg.userNotFound);
                }
                else {
                    if (media == "mobile" && result.mobile && result.mobileVerified) {
                        const smsObject = {
                            to: result.mobile,
                            token: result.passwordToken,
                            userId: result.userId
                        };
                        sms.createSMS(smsObject, sms.smsTypes.ATTEMPT_RESET_PASSWORD);
                        sendResponse.success(response, msg.verficationTokenSent + " " + result.mobile);
                    }
                    else {
                        const mailObject = {
                            email: result.email,
                            token: result.passwordToken,
                            userId: result.userId
                        };
                        mailer.createMail(mailObject, mailer.mailTypes.ATTEMPT_RESET_PASSWORD);

                        sendResponse.success(response, msg.verficationTokenSent + " " + result.email);

                    }
                }

            }
        });
    }


}
function validateResetPasswordInputs(body) {
    const TOKEN_LENGTH = 8;
    const errors = {};

    if (body.loginId) {
        if (!validate.email(body.loginId) || !validate.mobile(body.mobile)) {
            errors.loginId = msg.loginIdInvalid;
        }
    }
    else {
        errors.loginId = msg.loginIdRequired;
    }

    if (body.token) {
        if (!validate.id(body.token, TOKEN_LENGTH, TOKEN_LENGTH)) {
            errors.token = msg.tokenInvalid;
        }
    }
    else {
        errors.token = msg.tokenRequired;
    }

    if (body.password) {
        if (!validate.password(body.password)) {
            errors.password = msg.passwordInvalid;

        }
    }
    else {
        errors.password = msg.passwordRequired;
    }
    if (body.confirmPassword) {

        if (!validate.confirmPassword(body.confirmPassword)) {
            errors.confirmPassword = msg.confirmPasswordInvalid;

        }

    }
    else {
        errors.confirmPassword = msg.confirmPasswordInvalidRequired;
    }
    if (body.password && body.confirmPassword && body.password === body.confirmPassword) {
        errors.confirmPassword = msg.pAndCpMismatch;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    };

}
function authResetPasswordRouteHandler(request, response) {

    const RESET_PASSWORD = ["loginId", "token", "password", "confirmPassword"]; // loginId is email or mobile number
    const body = loadash.pick(request.body, RESET_PASSWORD);

    const { isValid, errors } = validateResetPasswordInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        const userDataProjections = {
            userId: 1,
            _id: 1,
            passwordToken: 1,
            passwordTokenTimeStamp: 1
        };
        dbOperations.findByEmailUsername(body.loginId, function findByEmailUsernameCbRoute(error, result) {
            if (error) {
                sendResponse.serverError(error);
            }
            else {
                if (!result) {
                    sendResponse.notFound(response, msg.userNotFound);
                }
                else {
                    if (body.token !== result.passwordToken) {
                        sendResponse.unauthorized(response, msg.tokenIncorrect);
                    }
                    else {
                        const timeNow = (new Date()).getTime();
                        if (timeNow  - result.passwordTokenTimeStamp >= EXPIRATION_DURATION) {
                            sendResponse.badRequest(response, msg.tokenExpired);
                        }
                        else {
                            dbOperations.resetPassword(result.userId, body.password, function resetPasswordCbRoute(error1, result1) {
                                if (error1) {
                                    sendResponse.serverError(response);
                                }
                                else {
                                    sendResponse.success(response, msg.resetPasswordSuccess);
                                }
                            });
                        }


                    }
                }
            }
        }, userDataProjections);

    }


}
module.exports = {
    authLoginRouteHandler,
    authRegisterRouteHandler,
    authAttemptToForgotPasswordRouteHandler,
    authResetPasswordRouteHandler
};