"use strict"
const User = require("../schema/User");
const { logger, sendResponse, session, encrypt } = require("../../utils");
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
        var that = this;
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
                                that.createUser(body, function registerDbCb3(error3, result3) {
                                    if (error3) {
                                        logger.error(error3);
                                        console.log("e3", error3);
                                        sendResponse.serverError(response);
                                    }
                                    else {
                                        sendResponse.success(response, "Successfuly registered.");
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
    }

};
module.exports = dbOperations;