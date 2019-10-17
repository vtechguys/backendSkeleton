'use strict'
const jwt = require('jsonwebtoken');

const { logger } = require('../logger');

const { constants } = require('../../config');

const jwtOperations = {

    generateJwt(id, role = "user", duration = 7){
        logger.debug('generateJwt');

        let jwtDuration = constants.JWT_DURATION;//duration is 24hrs

        if(role === "superadmin"){
            jwtDuration = jwtDuration / 4; //6hrs
        }
        else if(role === "admin"){
            jwtDuration = jwtDuration / 2; //12 hrs
        }
        else if(role === "user"){
            jwtDuration = jwtDuration * duration; // default 7 days
        }
        else{
            console.log("FUCK YOU!!");
            return "";
        }

        let token = jwt.sign({ userId: id }, constants.JWT_KEY, {
            expiresIn: jwtDuration
        });

        return token;
    },
    getSessionBySessionId(sessionId, callback){
        logger.debug(`getSessionByUserId ${userId}`);

        dbOperationsSession
        .findOne({
            "sessionId": sessionId
        })
        .exec((error, result)=>{
            if(error){
                logger.error(error);
                callback(error, null);
            }
            else{
                if(result.sessionId && result.userId){
                    callback(null, result);
                }
                else{
                    callback(null, null);
                }
            }
        });


    },
    fillJwtSession(userData, callback){
        logger.debug('fillJwtSession');
        let that = this;
        if(userData.userId){
            let duration = 7;
            if(userData.rememberMe){
                duration = duration * 2;
            }
            if(userData.role === "admin" || userData.role === "admin"){
                duration = 1; // for higher roles max 1 day expiry limit no matter what.
            }
            let token = that.generateJwt(userData.userId, userData.role, duration);

            userData["objectId"] = userData._id;

            delete userData._id;

            userData["sessionId"] = token;
            
            const uuid = userData["uuid"];

            userData["uuid"] = "xxxxxxxxxx";


            if(uuid && appContants.sessionType !== "single"){
                userData["uuid"] = uuid;
            }


            Session
            .find({
                "userId": userData.userId,
                "uuid": userData.uuid
            })
            .remove((error, result)=>{
                if(error){
                    callback(error, null);
                }
                else{
                    that.storeSession(userData, callback);
                }
            })
        }
        else{
            let error = {
                msg: "REQUIRED USERID"
            };
            callback(error, null);
        }
    },
    storeSession(userData, callback){
        logger.debug('storeSession');
        Session
        .create(userData, (error, result)=>{
            if(error){
                logger.error(error);
                callback(error, null);
            }
            else{
                callback(null, result);
            }
        });
    }




};

module.exports = jwtOperations;
