"use strict"
const User = require("../schema/User");
const { logger, sendResponse, session, encrypt, mailer, generate } = require("../../utils");
const { assignUserId, encryptPassword } = require('../functions');

const dbOperations = {
    doLogin(body, response) {
        logger.debug('USER_CRUD doLogin');
        var that = this;
        that
            .findByEmailUsername(body.loginId, function doLoginDbCb1(error, result) {
                if (error) {
                    logger.error(error);
                    sendResponse.serverError(response);
                }
                else {
                    if (!result) {
                        sendResponse.notFound(response, "User not found.");
                    }
                    else {
                        const passwordHash = encrypt.sha512(body.password, result.salt).hash;
                        if (passwordHash != result.password) {
                            sendResponse.unauthorized(response, "Password incorrect.");
                        }
                        else {
                            session.fillJwtSession(result, response);
                        }
                    }
                }
            });
    },
    register(body, response) {
        logger.debug('register this user');
        const that = this;
        that.findByEmail(body.email, function registerDbCb(error, result) {
            if (error) {
                logger.error(error);
                sendResponse.serverError(response);
            }
            else {
                if (result) {
                    sendResponse.badRequest(response, "Email alreay taken.");
                }
                else {
                    that.findByUsername(body.username, function registerDbCb2(error2, result2) {
                        if (error2) {
                            logger.error(error2);
                            sendResponse.serverError(response);
                        }
                        else {
                            if (result2) {
                                sendResponse.badRequest(response, "Username already taken.");
                            }
                            else {
                                encryptPassword(body, body.password);
                                body.role = "guest";

                                const token = body.emailToken = generate.randomString(8);
                                body.emailTokenTimeStamp = ( new Date() );

                                that.createUser(body, function registerDbCb3(error3, result3) {
                                    if (error3) {
                                        logger.error(error3);
                                        sendResponse.serverError(response);
                                    }
                                    else {

                                        const mailObject = {
                                            userId: result3.userId,
                                            email: result3.email,
                                            token: token
                                        };
                                        mailer.createMail(mailObject, mailer.mailTypes.ACCOUNT_ACTIVATION_LINK);

                                        sendResponse.success(response, "Successfuly registered. Please consider to confirm Email.");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    findByEmailUsername(loginId, cb) {
        logger.debug("USER_CRUD findByEmailOrUsername");

        const QUERY = {
            "$or": [
                {
                    "email": loginId
                },
                {
                    "username": loginId
                }
            ]
        };

        const PROJECTIONS = {

        };

        User
            .findOne(QUERY, PROJECTIONS)
            .exec(function findByEmailOrUsernameDbCb(error, queryResult) {
                if (error) {
                    cb(error, null);
                }
                else {
                    if (queryResult && queryResult.userId) {
                        cb(null, queryResult);
                    }
                    else {
                        cb(null, null);
                    }
                }
            });
    },
    findUserForThisQuery(Query = {}, Projection = {}, cb) {
        logger.debug("USER_CRUD findUserForThisQuery");
        User
            .findOne(Query, Projection)
            .exec(function findUserForThisQueryDbCb(error, queryResult) {
                if (error) {
                    cb(error, null);
                }
                else {
                    if (queryResult) {
                        cb(null, queryResult);
                    }
                    else {
                        cb(null, null);
                    }
                }
            });
    },
    createUser(userData, cb) {
        logger.debug("USER_CRUD createUser");
        assignUserId(userData);
        User
            .create(userData, function createUserDbCb(error, result) {
                if (error) {
                    cb(error, null);
                }
                else {
                    cb(null, result);
                }
            });
    },
    findByEmail(email, cb) {
        logger.debug('USER_CURD findByEmail');
        var that = this;
        const QUERY = {
            'email': email
        };
        const PROJECTION = {};
        that.findUserForThisQuery(QUERY, PROJECTION, cb);
    },
    findByUsername(username, cb) {
        logger.debug('USER_CURD findByUsername');
        var that = this;
        const QUERY = {
            'username': username
        };
        const PROJECTION = {};
        that.findUserForThisQuery(QUERY, PROJECTION, cb);
    },
    addEmailOrMobileToken(userId, tokenType, media, cb){
        const TOKEN_LENGTH = 8;
        const OTP_LENGTH = 6;

        const FIND_QUERY = {
            "userId": userId
        };
        let token ;
        if(tokenType == "token"){
            token = generate.randomString(TOKEN_LENGTH);
        }
        else{
            token = generate.randomNumber(OTP_LENGTH);
        }


        const UPDATE_QUERY_SET = {

        };
       

        if(media === "mobile"){
            UPDATE_QUERY_SET.mobileToken = token;
            UPDATE_QUERY_SET.mobileTokenTimeStamp = (  ( new Date() ).getTime() ); // time of creating 
        }
        else{
            UPDATE_QUERY_SET.emailToken = token;
            UPDATE_QUERY_SET.emailTokenTimeStamp =  (  ( new Date() ).getTime() );
        }

        const UPDATE_QUERY = {
            "$set": UPDATE_QUERY_SET
        };

        User
        .findOneAndUpdate(FIND_QUERY, UPDATE_QUERY)
        .exec(function addEmailOrMobileTokenDbCb(error, result){
            if(error){
                cb(error, null);
            }
            else{
                cb(null, result);
            }
        });
    }

};
module.exports = dbOperations;