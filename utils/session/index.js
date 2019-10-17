'use strict'

const logger = require('../logger');
const sendResponse = require('../responser');
const { constants } = require('../../config');
const jwtOps = require('../jwt');

const sessionOperations = {

    fillWebSession: function (request, userData) {
        logger.debug('config utils fillWebSession');
        request.session.user = userData;
        request.session.save();
        if (userData.rememberMe == true) {
            var thirtyDays = 30 * 24 * 60 * 60 * 1000;
            request.session.cookie.expires = new Date(Date.now() + thirtyDays);
        }
    },

    fillAppSession: function (userData, responseObject, response) {
        logger.debug('config utils fillAppSession');

        userData._id = undefined; //prevent duplicate record error
        userData = userData.toObject();
        userData.sessionId = responseObject.sessionId;
        userData.uuid = "xxxxxxxxxx";

        Session.create(userData, function (error, result) {
            if (error) {
                logger.error(error);
            }
            else {
                response.send(responseObject);
            }
        });
    },

    fillSession: function (request, response, result) {
        logger.debug('Utils fillSession');

        const userData = result.toObject();

        userData.password1 = undefined;
        userData.salt = undefined;
        userData.passwordTokenStamp = undefined;
        userData.emailActivationToken = undefined;
        userData.forgotPasswordToken = undefined;
        userData.mobileVerificationCode = undefined;
        userData.mobileTokenStamp = undefined;
        userData.locationHistory = undefined;

        userData = userData.toObject();

        if (userData.social && userData.social[0] && userData.social[0].sId) {
            userData.connectionType = userData.social[0].connection;
            userData.social = true;
        }
        userData.social = undefined;

        if (userData.temporaryMobile && userData.countryCode) {
            userData.temporaryMobile = userData.temporaryMobile.split(userData.countryCode)[1];
        }

        if (userData.mobile && userData.countryCode) {
            userData.mobile = userData.mobile.split(userData.countryCode)[1];
        }



        if (constants.SESSION_MODE === 'jwt') {

            jwtOps.fillJwtSession(request, userData, function (error, userData2) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (userData2) {
                        const responseObject = {
                            code: 200,
                            message: "Session created.",
                            success: true
                        };

                        responseObject.sessionId = userData2.sessionId;

                        userData2 = userData2.toObject();

                        delete userData2.uuid;
                        delete userData2.sessionId;

                        responseObject.data = { 
                            "profile": userData2 
                        };
                        
                        sendResponse.directSendJSON(response, responseObject);
                        
                        
                    }
                }

            });
        }
        else {
            //obsolete dubtful
            if (request.body.appCall === true) {
                if (request.body.sessionId != undefined) {
                    Session.find({ sessionId: request.body.sessionId }).remove(function (error, result) {
                        if (error) {
                            logger.error(error);
                        }
                    });
                }
                var randomString = this.randomStringGenerate(32);
                responseObject.sessionId = randomString + userData.username;
                var sid = responseObject.sessionId;
                responseObject.data = { "profile": userData };
                this.fillAppSession(userData, responseObject, response);
                if (responseObject.callback) {
                    responseObject.callback(null, { sessionId: sid });
                }
            }
            else {
                this.fillWebSession(request, userData);
                responseObject.data = { "profile": userData2 };
                response.send(responseObject);
                if (responseObject.callback) {
                    responseObject.callback(null);
                }
            }
        }
    },

    webSessionDestroy: function (request, response) {
        logger.debug('config utils webSessionDestroy');
        request.session.destroy(function (error) {
            if (error) {
                logger.error(error);
            }
            else {
                // utils.success(response);
                utils.response(response, 'success', "Logged out successfully");
                // response.json({ message: "success",code:200,success:true});
            }
        });
    },

    appSessionDestroy: function (id, response) {
        logger.debug('config utils appSessionDestroy');

        Session.find({ sessionId: id }).remove(function (error, result) {
            if (error) {
                logger.error(error);
            }
            else {
                logger.debug('crud result');
                // response.json({ message: "success" });
                // utils.success(response);
                utils.response(response, 'success', "Logged out successfully");
            }
        });
    },
};
module.exports = sessionOperations;