'use strict'
const jwt = require('jsonwebtoken');

const  logger  = require('../logger');

const { constants } = require('../../config');

const SessionCRUD = require('../../db/crudOperation/session');

function returnSessionDurationBasedOnRole(role, duration = 7, rememeberMe = false){
    let jwtDuration = constants.JWT_DURATION;//duration is 24hrs
    if (role === 'superadmin') {
        jwtDuration = jwtDuration / 4; //6hrs
    }
    else if (role === 'admin') {
        jwtDuration = jwtDuration / 2; //12 hrs
    }
    else if (role === 'user' || role === 'guest') {
        if(rememeberMe){
            jwtDuration = jwtDuration * duration * 2; // default 7 days
        }
        else{
            jwtDuration = jwtDuration * duration; // default 7 days
        }
    }
    return jwtDuration;
}

const jwtOperations = {

    generateJwt(id, role = 'user', duration = 7) {
        logger.debug('generateJwt');
        let jwtDuration = returnSessionDurationBasedOnRole(role, duration, rememberMe);

        let token = jwt.sign({ userId: id }, constants.JWT_KEY, {
            expiresIn: jwtDuration
        });

        return token;
    },
    getSessionBySessionId(sessionId, callback) {
        logger.debug('Utils Jwt getSessionBySessionId');

        SessionCRUD
            .getSessionBySessionId(sessionId, function utilsGetSessionBySessionIdCb(error, result) {
                if (error) {
                    logger.error(error);
                    return callback(error, null);
                }
                else {
                    return callback(null, result);
                }
            });

    },
    fillJwtSession(userData, callback) {
        logger.debug('fillJwtSession');
        const context = this;
        if (userData.userId) {
            let duration = 7;

            if (userData.rememberMe) {
                duration = duration * 2;
            }

            let token = context.generateJwt(userData.userId, userData.role, duration);
            if(!token || token && token.length == 0){
                return callback(null, null);
            }
            userData['objectId'] = userData._id;
            delete userData._id;

            userData['sessionId'] = token;

            const uuid = userData['uuid'];

            userData['uuid'] = 'xxxxxxxxxx';


            if (uuid && constants.SESSION_TYPE !== 'single') {
                userData['uuid'] = uuid;
            }
            SessionCRUD
                .removeAllSessionForThisUser(userData, function utilsFillJwtSessionCb1(error, result) {
                    if (error) {
                        logger.error(error);
                        return callback(error, null);
                    }
                    else {
                        
                        return context.storeSession(userData, callback);
                    }
                });
        }
        else {
            let error = {
                msg: 'REQUIRED USERID'
            };
            callback(error, null);
        }
    },
    storeSession(userData, callback) {
        logger.debug('storeSession');
        SessionCRUD
            .createSession(userData, function utilsStoreSessionCb(error, result) {
                if (error) {
                    logger.error(error);
                    return callback(error, null);
                }
                else {
                    return callback(null, result);
                }
            });
    }
};

module.exports = jwtOperations;
