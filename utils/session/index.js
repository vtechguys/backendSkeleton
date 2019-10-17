'use strict'

const logger = require('../logger');
const sendResponse = require('../responser');
const { constants } = require('../../config');

const jwtOps = require('./jwt');



function fillSession(userData, response) {
    logger.debug('Utils fillSession');

    const userData = result.toObject();

    delete userData.password1;
    delete userData.salt;
    delete userData.passwordTokenStamp;
    delete userData.emailActivationToken;
    delete userData.forgotPasswordToken;
    delete userData.mobileVerificationCode;
    delete userData.mobileTokenStamp;
    delete userData.locationHistory;


    if (userData.social && userData.social[0] && userData.social[0].sId) {
        userData.connectionType = userData.social[0].connection;
        userData.social = true;
    }
    delete userData.social;

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
                callback(error, null);
            }
            else {
                if (sessionData && sessionData.sessionId) {
                    const responseObject = {
                        code: 200,
                        message: "Session created.",
                        success: true
                    };

                    responseObject.sessionId = sessionData.sessionId;

                    sessionData = sessionData.toObject();

                    delete sessionData.uuid;
                    delete sessionData.sessionId;

                    responseObject.data = {
                        profile: sessionData
                    };

                    sendResponse.directSendJSON(response, responseObject);


                }
            }

        });
    }
    else {
        console.log("EXPRESS_WEB_SESSIONS_REMOVED");
        process.exit();
    }
}

module.exports = {
    fillJwtSession: fillSession,
    jwtOperations: jwtOps
};