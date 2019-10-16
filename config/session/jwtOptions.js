const jwt = require('jsonwebtoken');
const Session = require('../../db/model/session');
const logger = require('../logger');
const appContants = require('../appConstants/index.js');

const jwtOperations = {

    generateJwt(id, role = "user", duration = 7){
        logger.debug('generateJwt');

        let expiryDuration = duration;
        let jwtDuration = appContants.jwtDuration;//duration is 24hrs

        if(role === "superadmin"){
            duration
            jwtDuration = jwtDuration / 4; //6hrs
        }
        else if(role === "admin"){
            jwtDuration = jwtDuration / 2; //12 hrs
        }
        else if(role === "vender"){
            jwtDuration = jwtDuration * expiryDuration; //24hrs * duration(1week)
        }
        else if(role === "driver"){
            expiryDuration = expiryDuration * 2;
            jwtDuration = jwtDuration * expiryDuration;
        }
        else if(role === "user"){
            expiryDuration = expiryDuration * 4;
            jwtDuration = jwtDuration * expiryDuration;
        }

        let token = jwt.sign({ userId: id }, appContants.jwtKey, {
            expiresIn: jwtDuration
        });

        return token;
    },
    getSessionBySessionId(sessionId, callback){
        logger.debug(`getSessionByUserId ${userId}`);

        Session
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
                    logger.error(error);
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
