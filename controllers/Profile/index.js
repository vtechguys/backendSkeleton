'use strict'

const dbOperations = require('../../db/crudOperation/user');
const { sendResponse, logger, mailer, messenger } = require('../../utils');
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
function validate(){

}
function profileRegisterMobile(request, response){
    const TYPE = 'mobile';
    const userId = request.userId;
    dbOperations
    .addToken(userId, TYPE, function addTokenCbRoute(error, result){
        if(error){
            logger.error(error);
            sendResponse.serverError(response);
        }
        else{
            if(!result){
                sendResponse.notFound(response, msg.userNotFound);
            }
            else{
                // token added successfully now send otp
                const msgObj = {

                };
                messenger.createSMS(msgObj, messenger.smsTypes.MOBILE_ACTIVATION);
                sendResponse.success(response, msg.mobileNumberNoted);
            }
        }
    });

}
function profileMobileVerification(request, response){

}
function profileRequestMobileVerification(request, response){
    
}