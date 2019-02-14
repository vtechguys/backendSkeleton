'use strict'
const utils = require('../../utils');
const _ = utils.loadash;
const validate = utils.validate;
const sendResponse = utils.sendResponse;
const encrypt = utils.encrypt;


const config = require('../../config');
const msg = config.msg;

const UserModel = require('../../db/schema/User');

function loginValidate(info){
    const errors = {};
    if(info && Object.keys(info) > 0){
        let isValidLoginId = false;
        let isValidPassword = false;
        if( info.loginId && ( validate.email(info.loginId) || validate.username(info.loginId) ) ){
            isValidLoginId = true;
        }
        if(!isValidLoginId){
            errors["loginId"] = msg.login.loginInvalid;
        }

        if( info.password && ( validate(info.password)) ){
            isValidPassword = true;
        }
        if(!isValidPassword){
            errors["password"] = msg.login.passwordInvalid;
        }
        
    }
    else{
        errors["loginId"] = msg.login.loginIdRequired;
        errors["password"] = msg.login.passwordRequired;
    }

    return {
        errors: errors,
        isValid: _.isEmpty(errors)
    };
}



exports.login = function(request, response){
    let body = _.pick(request.body, ["loginId", "password"]);

    const { errors, isValid } = loginValidate( body );
    if(!isValid){
        UserModel
        .findOne({
            "$or": [
                { "email": body.loginId },
                { "password": body.password }
            ]

        })
        .exec((error, result)=>{
            if(error){
                sendResponse.serverError(repsonse);
            }
            else{
                if(!result){
                    sendResponse.notFound(response, msg.login.userNotFound);
                }
                else{
                    let password = result.password;
                    let salt = result.salt;
                    let hash = encrypt.sha512(body.password, salt).hash;
                    if(hash === password){
                        let userData = result.toObject();
                        delete userData.password;
                        sendResponse.success(response, msg.login.successlogIn, userData);
                    }
                    else{
                        sendResponse.unauthorized(response, msg.login.passwordIncorrect);
                    }

                }
            }
        });
    }
    else{
        sendResponse.badRequest(response, msg.errors.badRequest, null, errors);
    }
};