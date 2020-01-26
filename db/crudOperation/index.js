'use strict'

const UserCRUD = require('./user');
const { logger, sendResponse, session } = require('../../utils');

const dbOpeartions = {
    checkUserAndThenCreateSession(userData, response){
        logger.debug('INDEX_CRUD checkUserAndThenCreateSession');
        const QUERY = {
            userId: userData.userId
        };
        const PROJECTIONS = {};
        UserCRUD
            .findUserForThisQuery(QUERY, PROJECTIONS, function checkUserAndThenCreateSessionDbCb(error, result){
                if(error){
                    logger.error(error);
                    sendResponse.serverError();
                }
                else{
                    if(!result){
                        sendResponse.notFound(response, 'User not found.');
                    }
                    else{
                        session.fillJwtSession(result, response);
                    }
                }
            });
    }
};
module.exports = dbOpeartions;