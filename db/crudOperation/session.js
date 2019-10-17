'use strict'

const Session = require('../schema/Session');
const logger  = require('../../utils/logger');

const dbOperations = {
    getSessionBySessionId(sessionId, callback) {
        logger.debug("Session_CRUD getSessionBySessionId");
        Session
            .findOne({
                "sessionId": sessionId
            }, function getSessionBySessionIdDbCb(error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    if (result && result.sessionId && result.userId) {
                        callback(null, result);
                    }
                    else {
                        callback(null, null);
                    }
                }
            });
    },
    getSessionForThisUser(userData, callback) {
        console.log(logger);
        logger.debug("Session_CRUD getSessionForThisUser");
        Session
            .find({
                "userId": userData.userId,
                "uuid": userData.uuid
            }, function getSessionForThisUserDbCb(error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    if (result) {
                        callback(null, result);
                    }
                    else {
                        callback(null, null);
                    }
                }
            });
    },
    removeAllSessionForThisUser(userData, callback) {
        logger.debug("Session_CRUD removeAllSessionForThisUser");
        Session
            .find({
                "userId": userData.userId,
                "uuid": userData.uuid
            })
            .remove(function removeAllSessionForThisUserDbCb(error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    callback(null, userData);
                }
            })
    },
    createSession(sessionData, callback) {
        logger.debug("Session_CRUD createSession");
        Session
            .create(sessionData,
                function createSessionDbCb(error, result) {
                    if (error) {
                        logger.error(error);
                        callback(error, null);
                    }
                    else {
                        callback(null, result);
                    }
                });

    },
    getBySessionIdAndRemove(sessionId, callback) {
        Session
            .find({
                sessionId: sessionId
            })
            .remove(function (error, result) {
                if (error) {
                    logger.error(error);
                    callback(error, null);
                }
                else {
                    callback(null, result);
                }
            });
    }


};
module.exports = dbOperations;