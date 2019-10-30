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
                                body.emailTokenTimeStamp = (new Date());

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
    findByEmailUsername(loginId, callback, projections = {}) {
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



        User
            .findOne(QUERY, projections)
            .exec(function findByEmailOrUsernameDbCb(error, queryResult) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (queryResult && queryResult.userId) {
                        callback(null, queryResult);
                    }
                    else {
                        callback(null, null);
                    }
                }
            });
    },
    findUserForThisQuery(Query = {}, Projection = {}, callback) {
        logger.debug("USER_CRUD findUserForThisQuery");
        User
            .findOne(Query, Projection)
            .exec(function findUserForThisQueryDbCb(error, queryResult) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (queryResult) {
                        callback(null, queryResult);
                    }
                    else {
                        callback(null, null);
                    }
                }
            });
    },
    createUser(userData, callback) {
        logger.debug("USER_CRUD createUser");
        assignUserId(userData);
        User
            .create(userData, function createUserDbCb(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },
    findByEmail(email, callback, projections = {}) {
        logger.debug('USER_CURD findByEmail');
        var that = this;
        const QUERY = {
            'email': email
        };
        that.findUserForThisQuery(QUERY, projections, callback);
    },
    findByUsername(username, callback, projections = {}) {
        logger.debug('USER_CURD findByUsername');
        var that = this;
        const QUERY = {
            'username': username
        };
        that.findUserForThisQuery(QUERY, projections, callback);
    },
    addPasswordToken(userIdOrEmail, callback) {
        logger.debug('User_CRUD addPasswordToken');

        const TOKEN_LENGTH = 8;


        const FIND_QUERY = {
            "$or": [
                {
                    "userId": userIdOrEmail
                },
                {
                    "email": userIdOrEmail
                }
            ]
        };


        const UPDATE_QUERY_SET = {
            passwordToken: generate.randomNumber(TOKEN_LENGTH),
            passwordTimeStamp: ((new Date()).getTime())
        };

        const UPDATE_QUERY = {
            "$set": UPDATE_QUERY_SET
        };

        User
            .findOneAndUpdate(FIND_QUERY, UPDATE_QUERY, { new: true })
            .exec(function addEmailOrMobileTokenDbCb(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    if (!result) {
                        callback(null, null);
                    }
                    else {
                        callback(null, result);
                    }
                }
            });
    },
    resetPassword(loginId, password, callback) {
        logger.debug('User_CRUD resetPassword');

        const QUERY = {
            'userId': loginId
        };
        const passwordObject = encryptPassword({}, password);
        const UPDATE_QUERY = {
            '$set': {
                password: passwordObject.password,
                salt: passwordObject.salt
            },
            '$unset': {
                passwordToken: 1,
                passwordTimeStamp: 1
            }
        };
        User
            .findOneAndUpdate(QUERY, UPDATE_QUERY)
            .exec(function resetPasswordDbCb(error, result) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    },
    findByUserId(userId, callback, projections = {}){
        logger.debug('User_CRUD findByUserId');
        const QUERY = {
            'userId': userId
        };
        this.findUserForThisQuery(QUERY, projections, callback); 
    }

};
module.exports = dbOperations;