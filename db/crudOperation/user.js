"use strict"
const User = require("../schema/User");
const { logger, sendResponse, session, encrypt, mailer, generate } = require("../../utils");
const { assignUserId, encryptPassword } = require('../functions');

const dbOperations = {
    doLogin(body, response) {
        logger.debug('USER_CRUD doLogin');
        const that = this;
        this
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
        this.findByEmail(body.email, function registerDbCb(error, result) {
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
        const that = this;
        const QUERY = {
            'email': email
        };
        this.findUserForThisQuery(QUERY, projections, callback);
    },
    findByUsername(username, callback, projections = {}) {
        logger.debug('USER_CURD findByUsername');
        const that = this;
        const QUERY = {
            'username': username
        };
        that.findUserForThisQuery(QUERY, projections, callback);
    },
    addPasswordToken(userIdOrEmail, media, callback) {
        logger.debug('User_CRUD addPasswordToken');

        const TOKEN_LENGTH = 8;


        const FIND_QUERY = {

            "email": userIdOrEmail
               
        };


        const UPDATE_QUERY_SET = {
            passwordToken: generate.randomString(TOKEN_LENGTH),
            passwordTimeStamp: new Date()
        };

        const UPDATE_QUERY = {
            "$set": UPDATE_QUERY_SET
        };
        User
            .findOneAndUpdate(FIND_QUERY, UPDATE_QUERY, { new: true })
            .exec(function addPasswordTokenDbCb(error, result) {
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
    },
    _assignRole(userId, role, callback){
        logger.debug('User_CRUD assignRole');
        const USER_QUERY = {
            'userId': userId,
            'role': {
                '$ne': 'superadmin'
            }
        };
        const UPDATE_QUERY = {
            '$set': {
                'role': role
            }
        };
        console.log(USER_QUERY, UPDATE_QUERY);
        this.getOneUserAndUpdateFields(USER_QUERY, UPDATE_QUERY, callback)
    },
    getOneUserAndUpdateFields(FIND_QUERY, UPDATE_QUERY, callback, options){
        const updateOptions = options || {
            // new: true
        };
        User
        .findOneAndUpdate(FIND_QUERY, UPDATE_QUERY, updateOptions)
        .exec(function getOneUserAndUpdateFieldsCb(error, result){
            if(error){
                callback(error, null);
            }
            else{
                if(!result){
                    callback(null, null);
                }
                else{
                    callback(null, result);
                }
            }
        });
    },
    setVerified(userId, verified, callback){
        const setField = {

        };
        if(verified === 'email'){
            setField.emailVerified = true;
        }
        else if(verified === 'mobile'){
            setField.mobileVerified = true;
        }

        const FIND_QUERY = {
            'userId': userId
        };
        const UPDATE_QUERY = {
            '$set': setField
        };

        this
        .getOneUserAndUpdateFields(FIND_QUERY, UPDATE_QUERY, callback);
    },
    addToken(userId, type, callback){
        const TOKEN_LENGTH = 8;
        const { generate } = require('../../utils');
        const token = generate.randomString(TOKEN_LENGTH);

        const setFields = {};
        if(type == "email"){
            setFields.emailToken = token;
            setFields.emailTokenTimeStamp = new Date();
        }
        else if(type == "mobile"){
            setFields.mobileToken = token;
            setFields.mobileTokenTimeStamp = new Date();
        }

        const FIND_QUERY = {
            'userId': userId
        };
        const UPDATE_QUERY = {
            '$set': setFields
        };
        this.getOneUserAndUpdateFields(FIND_QUERY, UPDATE_QUERY, callback);
    }

};
module.exports = dbOperations;