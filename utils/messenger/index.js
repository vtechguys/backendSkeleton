'use strict'


const { constants } = require('../../config');

const messageService = require('msg91');
const { sms: templateSMS } = require('../../template');

const MSG_91_MESSAGE_TYPE = {
    TRANSACTIONS: 'transactions',
    PROMOTIONS: 'promotions'
};




const SMS_TYPES = {
    MOBILE_ACTIVATION: 'moblieActivation',
    ATTEMPT_RESET_PASSWORD: 'resetPassword',
    SUCCESS_RESET_PASSWORD: 'resetPasswordSuccess'
};


function mobileActivationSMS(msgObj, type){
    const TO = msgObj.to;
    const TEXT = templateSMS.mobileActivationTemplate(msgObj);
    _sendSMS(TO, TEXT, type);
}

const smsOperations = {
    createSMS(msgObj, type){
        
        switch(type){
            case SMS_TYPES.MOBILE_ACTIVATION:
               return mobileActivationSMS(msgObj, MSG_91_MESSAGE_TYPE.TRANSACTIONS); 
        }
    },
    smsTypes: SMS_TYPES
};

module.exports = smsOperations;

function _sendSMS(to, text, type){
    let message =  messageService(constants.MSG91_API_KEY, constants.MSG91_SENDER_ID, msg.MSG91_ROUTE_ID_DEFAULT);

    if(type == MSG_91_MESSAGE_TYPE.PROMOTIONS){
        message =  messageService(constants.MSG91_API_KEY, constants.MSG91_SENDER_ID, msg.MSG91_ROUTE_ID_PROMOTIONAL);
    }
    else if(type == MSG_91_MESSAGE_TYPE.TRANSACTIONS){
        message =  messageService(constants.MSG91_API_KEY, constants.MSG91_SENDER_ID, msg.MSG91_ROUTE_ID_PROMOTIONAL);
    }

    message.send(to, text);
}
