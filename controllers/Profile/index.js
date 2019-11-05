'use strict'

const dbOperations = require('../../db/crudOperation/user');
const { sendResponse, logger, mailer } = require('../../utils');
const msg = require('./msgconfig');

function profileRequestEmailVerification(request, response){
    const userData = request.userData;
    
    if(userData.emailVerified){
       sendResponse.badRequest(response, msg.emailAlreadyVerified); 
    }
    else{
        const TYPE = 'email';
        dbOperations
            .addToken(userData.userId, TYPE, function addTokenCbRoute(error, result){
                if(error){
                    logger.error(error);
                    sendResponse.serverError(response);
                }
                else{
                    const mailData = {
                        userId: userData.userId,
                        email: userData.email,
                        token: result.emailToken
                    };
                    mailer.createMail(mailData, mailer.mailTypes.ACCOUNT_ACTIVATION_LINK);
                    sendResponse.success(response, msg.sentEmailVerificationMail);
                }
            });
    }

}

function profileRegisterMobile(request, response){

    const userId = request.userId;
    dbOperations
    .findByMobile(body.mobile, function findByMobileCbRoute(error1, result1){
        if(error1){
            logger.error(error1);
            sendResponse.serverError(response);
        }
        else{
            
        }
    });

    dbOperations
    .addToken(userId, 'mobile', function addTokenCbRoute(error, result){
        if(error){
            logger.error(error);
            sendResponse.serverError(response);
        }
        else{

        }
    });

}
function profileMobileVerification(request, response){

}
function profileRequestMobileVerification(request, response){

}