"use strict"
const User = require("../schema/User");
const { logger } = require("../../utils");
const { assignUserId } = require('../functions/user');

const dbOperations = {

    findByEmailOrUsername(loginId, cb) {
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
            .exec(function dbfindByEmailOrUsernameDbCb(error, queryResult) {
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
    }

};
module.exports = dbOperations;