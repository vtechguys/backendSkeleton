'use strict'

const logger = require('../logger');
const sendResponse = require('../responser');
const { constants } = require('../../config');

const jwtOps = require('./jwt');

function delUnnecessary(userDataOld){
    const userData = userDataOld.toObject();
        delete userData.password;
        delete userData.salt;
        delete userData.passwordTokenStamp;
        delete userData.emailActivationToken;
        delete userData.forgotPasswordToken;
        delete userData.mobileVerificationCode;
        delete userData.mobileTokenStamp;
    return userData;
}

function fillSession(result, response) {
    logger.debug('Utils fillSession');

    const userData = delUnnecessary(result);

    // if (userData.social && userData.social[0] && userData.social[0].sId) {
    //     userData.connectionType = userData.social[0].connection;
    //     userData.social = true;
    // }
    // delete userData.social;

    if (userData.temporaryMobile && userData.countryCode) {
        userData.temporaryMobile = userData.temporaryMobile.split(userData.countryCode)[1];
    }

    if (userData.mobile && userData.countryCode) {
        userData.mobile = userData.mobile.split(userData.countryCode)[1];
    }



    if (constants.SESSION_MODE === 'jwt') {

        jwtOps.fillJwtSession(userData, function (error, sessionData) {
            if (error) {
                logger.error(error);
                sendResponse.serverError(response);
            }
            else {
                if (sessionData && sessionData.sessionId) {
                    let sessionDataNew = sessionData.toObject();

                    delete sessionDataNew.uuid;
                    delete sessionDataNew.sessionId;
                    sessionDataNew._id = sessionDataNew.objectId;
                    delete sessionDataNew.objectId;

                    const data = {
                        'profile': sessionDataNew
                    };
                    sendResponse.success(response, 'Session created.', data);
                }
                else{
                    // couldnot create the session bcz of unknown role
                    sendResponse.badRequest(response, 'Could not create session for a unknown role');
                }
            }

        });
    }
    else {
        console.log('EXPRESS_WEB_SESSIONS_REMOVED');
        process.exit();
    }
}

module.exports = {
    fillJwtSession: fillSession,
    jwtOperations: jwtOps
};