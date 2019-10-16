"use strict"
const UserModel = require("../schema/User");
const config = require("../../config");
const logger = config.logger;

const SessionCRUD = require("../../config/session/jwtOptions");

const dbOperations = {

    findByEmailOrUsername(loginId, cb){
        logger.debug("doLogin CRUD");
        const QUERY = {
            "$or": [
                {
                    "email" : loginId
                },
                {
                    "username": loginId
                }
            ]
        };
        const PROJECTIONS = {

        };
        UserModel
        .findOne(QUERY, PROJECTIONS)
        .exec(function dbfindByEmailOrUsernameCallback(error, queryResult){
            if(error){
                cb(error, null);
            }
            else{
                if(queryResult && queryResult.userId){
                    cb(null, queryResult);
                }
                else{
                    cb(null, null);
                }
            }
        });
    },
    createSession(userData, cb){
        logger.debug("create session CRUD");
        SessionCRUD.fillJwtSession(userData, function fillJwtSessionCallback(error, queryResult){
            if(error){
                cb(error, null);
            }
            else{
                if(!queryResult){
                    cb(null, null);
                }
                else {
                    cb(null, queryResult);
                }
            }
        });
    }



};
module.exports = dbOperations;