'use strict'

const { loadash, validate, sendResponse, logger, sms, mailer } = require('../../utils');

const msg = require('./msgconfig');

const dbOperations = require('../../db/crudOperation/user');


const EXPIRATION_DURATION = 5 * 60 * 1000;


function validateLoginInputs(inputs) {

    const errors = {};


    if (inputs.loginId) {

        if (!validate.email(inputs.loginId) || !validate.username(inputs.loginId)) {
            errors.loginId = msg.loginIdInvalid;
        }
    }
    else {
        errors.loginId = msg.loginIdRequired;
    }

    if (inputs.password) {
        if (!validate.password(inputs.password)) {
            errors.password = msg.passwordInvalid;
        }
    }
    else {
        errors.password = msg.passwordInvalid;
    }

    if (!inputs.rememberMe || inputs.rememberMe && typeof inputs.rememberMe !== 'boolean') {
        inputs.rememberMe = false;
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


function validateRegistrationInputs(inputs) {

    const errors = {};

    if (inputs.email) {
        if (!validate.email(inputs.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }

    if (inputs.username) {
        if (!validate.username(inputs.username)) {
            errors.username = msg.usernameInvalid;
        }
    }
    else {
        errors.username = msg.usernameRequired;
    }
    let isValidPassword = false;
    if (inputs.password) {
        isValidPassword = true;
        if (!validate.password(inputs.password)) {
            isValidPassword = false;
            errors.password = msg.passwordInvalid;

        }
    }
    else {
        errors.password = msg.passwordRequired;
    }
    let isValidConfirmPassword = false
    if (inputs.confirmPassword) {
        isValidConfirmPassword = true;
        if (!validate.password(inputs.confirmPassword)) {
            isValidConfirmPassword = false;
            errors.confirmPassword = msg.confirmPasswordInvalid;

        }

    }
    else {
        errors.confirmPassword = msg.confirmPasswordRequired;
    }
    if (isValidConfirmPassword && isValidPassword && inputs.password !== inputs.confirmPassword) {
        errors.confirmPassword = msg.pAndCpMismatch;
    }
    if (inputs.firstName) {
        if (!validate.name(inputs.firstName)) {
            errors.firstName = msg.firstNameInvalid;
        }
    }
    else {
        errors.firstName = msg.firstNameRequired;
    }
    if (inputs.lastName) {
        if (!validate.name(inputs.lastName)) {
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
    const REGISTRATION_BODY = ['email', 'username', 'password', 'firstName', 'lastName', 'confirmPassword'];

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


function validateAttemptToForgotPasswordInputs(inputs) {
    const VALID_MEDIA = ['email', 'mobile'];
    const errors = {};
    if (inputs.email) {
        if (!validate.email(inputs.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }
    if(inputs.media){
        if (VALID_MEDIA.indexOf(inputs.media) == -1) {
            errors.media = msg.mediaNotSupported;
        }
    }
    else{
        errors.media = msg.mediaRequired;
    }




    return {
        isValid: loadash.isEmpty(errors),
        errors
    };
}
function authAttemptToForgotPasswordRouteHandler(request, response) {
    logger.debug('authAttemptToForgotPassword');
    const ATTEMPT_RESET_PASSWORD = ['email', 'media'];

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
                    if (body.media == 'mobile' && result.mobile && result.mobileVerified) {
                        const smsObject = {
                            to: result.mobile,
                            token: result.passwordToken,
                            userId: result.userId
                        };
                        sms.createSMS(smsObject, sms.smsTypes.ATTEMPT_RESET_PASSWORD);
                        sendResponse.success(response, msg.verficationTokenSent + ' ' + result.mobile);
                    }
                    else {
                        const mailObject = {
                            email: result.email,
                            token: result.passwordToken,
                            userId: result.userId
                        };
                        mailer.createMail(mailObject, mailer.mailTypes.ATTEMPT_RESET_PASSWORD);

                        sendResponse.success(response, msg.verficationTokenSent + ' ' + result.email);

                    }
                }

            }
        });
    }


}


function validateResetPasswordInputs(inputs) {
    const TOKEN_LENGTH = 8;
    const errors = {};

    if (inputs.email) {
        if (!validate.email(inputs.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }

    if (inputs.token) {
        if (!validate.id(inputs.token, TOKEN_LENGTH)) {
            errors.token = msg.tokenInvalid;
        }
    }
    else {
        errors.token = msg.tokenRequired;
    }

    let isValidPassword = false;
    if (inputs.password) {
        isValidPassword = true;
        if (!validate.password(inputs.password)) {
            isValidPassword = false;
            errors.password = msg.passwordInvalid;

        }
    }
    else {
        errors.password = msg.passwordRequired;
    }
    let isValidConfirmPassword = false
    if (inputs.confirmPassword) {
        isValidConfirmPassword = true;
        if (!validate.password(inputs.confirmPassword)) {
            isValidConfirmPassword = false;
            errors.confirmPassword = msg.confirmPasswordInvalid;

        }

    }
    else {
        errors.confirmPassword = msg.confirmPasswordRequired;
    }
    if (isValidConfirmPassword && isValidPassword && inputs.password !== inputs.confirmPassword) {
        errors.confirmPassword = msg.pAndCpMismatch;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    };

}
function authResetPasswordRouteHandler(request, response) {

    const RESET_PASSWORD = ['email', 'token', 'password', 'confirmPassword']; // loginId is email or mobile number
    const body = loadash.pick(request.body, RESET_PASSWORD);

    const { isValid, errors } = validateResetPasswordInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        const PROJECTIONS = {
            userId: 1,
            _id: 1,
            passwordToken: 1,
            passwordTokenTimeStamp: 1
        };
        dbOperations.findByEmail(body.email, function findByEmailUsernameCbRoute(error, result) {
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
                        const TOKEN_TIME_STAMP = ( new Date(result.passwordTokenTimeStamp) ).getTime();
                        const TIME_NOW = (  new Date() ).getTime();
                        if (TIME_NOW  - TOKEN_TIME_STAMP >= EXPIRATION_DURATION) {
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
        }, PROJECTIONS);

    }


}

function validateEmailActivationInputs(inputs){
    const TOKEN_LENGTH = 8;
    const errors = {};

    if (inputs.email) {
        if (!validate.email(inputs.email)) {
            errors.email = msg.emailInvalid;
        }
    }
    else {
        errors.email = msg.emailRequired;
    }

    if (inputs.token) {
        if (!validate.id(inputs.token, TOKEN_LENGTH)) {
            errors.token = msg.tokenInvalid;
        }
    }
    else {
        errors.token = msg.tokenRequired;
    }
    return {
        isValid: loadash.isEmpty(errors),
        errors
    }
}

function authEmailVerificationRouteHandler(request, response){
    logger.debug('authEmailActivationRouteHandler');
    
    const EMAIL_ACTIVATION_INPUTS = ['email', 'token'];
    const body = loadash.pick(request.body, EMAIL_ACTIVATION_INPUTS);
   
    const { isValid, errors } = validateEmailActivationInputs(body);


    if(!isValid){
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else{
        const PROJECTIONS = {
            'userId': 1,
            'emailToken': 1,
            'emailTokenTimeStamp': 1
        };
        dbOperations
        .findByEmail(body.email, function findByEmailCbRoute(error, result){
            if(error){
                logger.error(error);
                sendResponse.serverError(response);
            }
            else{
                if(!result){
                    sendResponse.notFound(response, msg.userNotFound);
                }
                else{
                    const TOKEN_TIME_STAMP = ( new Date(result.emailTokenTimeStamp) ).getTime();
                    const TIME_NOW = ( new Date() ).getTime();

                    if( TIME_NOW - TOKEN_TIME_STAMP  >= EXPIRATION_DURATION){
                        sendResponse.badRequest(response, msg.tokenExpired);
                    }
                    else{
                        if(result.emailToken != body.token){
                            sendResponse.badRequest(response, msg.tokenIncorrect);
                        }
                        else{
                            dbOperations
                            .setVerified(body.userId, 'email', function setVerifiedCbRoute(error1, result1){
                                if(error1){
                                    logger.error(error1);
                                    sendResponse.serverError(response);
                                }
                                else{
                                    sendResponse.success(response, msg.emailVerified);
                                }
                            });
                        }
                    }
                }
            }
        }, PROJECTIONS);
    }


}

module.exports = {
    authLoginRouteHandler,
    authRegisterRouteHandler,
    authAttemptToForgotPasswordRouteHandler,
    authResetPasswordRouteHandler,
    authEmailVerificationRouteHandler
};