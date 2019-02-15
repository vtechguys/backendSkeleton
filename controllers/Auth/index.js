'use strict'
const utils = require('../../utils');
const _ = utils.loadash;
const validate = utils.validate;
const sendResponse = utils.sendResponse;
const encrypt = utils.encrypt;


const config = require('../../config');
const msg = config.msg;
const appConstansts = config.constants;

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
            errors["loginId"] = msg.loginIdInvalid;
        }

        if( info.password && ( validate(info.password)) ){
            isValidPassword = true;
        }
        if(!isValidPassword){
            errors["password"] = msg.passwordInvalid;
        }
        
    }
    else{
        errors["loginId"] = msg.loginIdRequired;
        errors["password"] = msg.passwordRequired;
    }

    return {
        errors: errors,
        isValid: _.isEmpty(errors)
    };
};
/**
 * @params loginId, password
 * @access User
 * 
 */


exports.login = function(request, response){
    const body = _.pick(request.body, ["loginId", "password"]);

    const { errors, isValid } = loginValidate( body );
        if(!isValid){
            sendResponse.badRequest(response, msg.badRequest, undefined, errors);

        }
        else{


            UserModel
            .findOne({
                "$or": [
                    { "email": body.loginId },
                    { "username": body.password }
                ]
    
            })
            .exec((error, result)=>{
                if(error){
                    sendResponse.serverError(repsonse);
                }
                else{
                    if(!result){
                        sendResponse.notFound(response, msg.userNotFound);
                    }
                    else{
                        
                        let password = result.password;
                        let salt = result.salt;
                        let hash = encrypt.sha512(body.password, salt).hash;
                        if(hash === password){
                            let userData = result.toObject();
                            delete userData.password;
                            sendResponse.success(response, msg.successlfullogIn, userData);
                        }
                        else{
                            sendResponse.unauthorized(response, msg.passwordIncorrect);
                        }
    
                    }
                }
            });
        }


};

function registerBasics(body){
        const utils = require('../../utils');
        const encrypt = utils.encrypt;
        const userObj = {};
        userObj["userId"] = generate.randomString(appConstansts.USER_ID_LENGTH);
        userObj["firstName"] = body.firstName;
        userObj["lastName"] = body.lastName;
        userObj["email"] = body.email;
        userObj["emailVerified"] = false;
        userObj["code"] = body.code;
        userObj["temporaryMobile"] = body.mobile;
        userObj["mobileVerified"] = false;
        userObj["salt"] = encrypt.genRandomString(appConstansts.PASSWORD_SALT_LENGTH);
        userObj["password"] = encrypt.sha512( body.password, userObj["salt"]).hash;
        userObj["adhar"] = {
            "value": body.adharNo,
            "verified": false,
        };
        return userObj;
}



function registerValidate(info){
    const errors = {};
    if(info && Object.keys(info).length > 0){
        let isValidCode = false;
        if(info.code || info.code===""){
            isValidCode = validate.code(info.code);
            if(!isValidCode){
                errors["code"] = msg.codeInvalid;
            }
        }
        else{
            errors["code"] = msg.codeRequired;
        }
        let isValidMobileNo = false;
        if(info.mobile || info.mobile===""){
            isValidMobileNo = validate.mobile(info.mobile);
            if(!isValidMobileNo){
                errors["mobile"] = msg.mobileInvalid;
            }
        }
        else{
            errors["mobile"] = msg.mobileRequired;
        }
        let isValidPassword = false;
        if(info.password || info.password===""){
            isValidPassword = validate.password(info.password);
            if(!isValidPassword){
                errors["password"] = msg.passwordInvalid;
            }
        }
        else{
            errors["password"] = msg.passwordRequired;
        }
        let isValidFname = false;
        if(info.firstName || info.firstName === ""){
            isValidFname = validate.name(info.firstName);
            if(!isValidFname){
                errors["firstName"] = msg.firstNameInvalid;
            }
        }
        else{
            errors["firstName"] = msg.firstNameRequired;
        }
        let isValidLname = false;
        if(info.lastName || info.lastName === ""){
            isValidLname = validate.name(info.lastName);
            if(!isValidLname){
                errors["lastName"] = msg.lastNameInvalid;
            }
        }
        else{
            errors["lastName"] = msg.lastNameRequired;
        }
        //adhar compulsary
        let isValidAdharNo = false;
        if(info.adharNo || info.adharNo === ""){
            isValidAdharNo = validate.adharNo(info.adharNo);
            if(!isValidAdharNo){
                errors["adharNo"] = msg.adharNoInvalid;
            }
        }
        else{
            errors["adharNo"] = info.adharNoRequired;
        }
        //pan and voter id not compulsary;
        let isValidPanNo = true;
        if(info.panNo || info.panNo === ""){
            isValidPanNo = validate.panNo(info.panNo);
            if(!isValidPanNo){
                errors["panNo"] = msg.panNoInvalid;
            }
        }
        let isValidVoterIdNo = true;
        if(info.voterIdNo || info.voterIdNo === ""){
            isValidVoterIdNo = validate.panNo(info.voterIdNo);
            if(!isValidVoterIdNo){
                errors["voterIdNo"] = msg.voterIdNoInvalid;
            }
        }
    }
    else{
        errors["code"] = msg.codeRequired;
        errors["mobile"] = msg.mobileRequired;
        errors["password"] = msg.passwordRequired;
        errors["email"] = msg.emailRequired;
        errors["firstName"] = msg.firstNameRequired;
        errors["lastName"] = msg.lastNameRequired;
    }

    return {
        errors: errors,
        isValid: _.isEmpty(errors)
    }
};
/**
 * @params code, mobile, password, email, firstName, lastName
 * @access Driver, Vender, Admin
 */
exports.registerVender = function(request, response){
    const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName", "adharNo", "panNo", "voterIdNo"]);
    const { errors, isValid } = registerValidate(body);

    if(!isValid){
        sendResponse.badRequest(response, msg.badRequest, undefined, errors);
    }
    else{
        let userObj = registerBasics(body);
        userObj["temporaryRole"] = "vender";

        UserModel
        .findOne({
            "$or":[
                { "temporaryMobile": body.mobile },
                { "mobile": body.mobile },
                { "email": body.email }
            ]
        })
        .exec((error, result)=>{
            if(error){
                sendResponse.serverError(response);
            }
            else{
                if(result && result.userId){
                    sendResponse.unauthorized(repsonse, msg.accountDuplicate);
                }
                else{
                    UserModel
                    .create(userObj, (error1, result1)=>{
                        if(error1){
                            sendResponse.serverError(error1);
                        }
                        else{
                            let userData = result1.toObject();
                            delete userData.password;
                            delete userData.salt;
                            //create jwt token here..
                            sendResponse.success(response, msg.successlfullRegister, { "profile": userData });
                        }
                    });
                }
            }
        });
    }

};
/**
 * @params code, mobile, password, email, firstName, lastName
 * @access Driver, Vender, Admin
 */
exports.registerDriver = function(request, response){
    const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName", "adharNo", "panNo", "voterIdNo"]);
    const { errors, isValid } = registerValidate(body);

    if(!isValid){
        sendResponse.badRequest(response, msg.badRequest, undefined, errors);

    }
    else{
        let userObj = registerBasics(body);
        userObj["temporaryRole"] = "driver";

    }

};
/**
 * @params code, mobile, password, email, firstName, lastName
 * @access Driver, Vender, Admin
 */
exports.registerAdmin = function(request, response){
    const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName", "adharNo", "panNo", "voterIdNo"]);
    const { errors, isValid } = registerValidate(body);

    if(!isValid){
        sendResponse.badRequest(response, msg.badRequest, undefined, errors);

    }
    else{
        let userObj = registerBasics(body);

        userObj["temporaryRole"] = "admin";

    }

};

function registerValidateViaOTP(info){
    const errors = {};

    if(info && Object.keys(info) > 0){
        let isValidMobileNo = false;
        let isValidCode = false;
        if(info.mobile || info.mobile===""){
            isValidMobileNo = validate.mobile(info.mobile);
            if(!isValidMobileNo){
                errors["mobile"] = msg.mobileInvalid;
            }
        }
        else{
            errors["mobile"] = msg.mobileRequired;
        }

        if(info.code || info.code === ""){
            isValidCode = validate.code(info.code);
            if(!isValidCode){
                errors["code"] = msg.codeInvalid;
            }
        }
        else{
            errors["code"] = msg.codeRequired;
        }
    }
    else{

    }

    return {
        errors: errors,
        isValid: _.isEmpty(errors)
    }
};


/**
 * @access User only
 */
exports.registerViaOTP = function(request, response){
    const body = _.pick( request.body, ["mobile"]);
    const { errors, isValid } = registerValidateViaOTP(body);
    if(!isValid){
        sendResponse.badRequest(response, msg.badRequest, undefined, errors);

    }
    else{
        const userObj = {};

        const utils = require('../../utils');
        const encrypt = utils.encrypt;
        const generate = utils.generate;

        userObj["userId"] = generate.randomString(appConstansts.USER_ID_LENGTH);

        userObj["salt"] = encrypt.genRandomString(appConstansts.PASSWORD_SALT_LENGTH);
        userObj["password"] = encrypt.sha512(generate.randomString(10), salt);

        userObj["temporaryMobile"] = body.mobile;
        userObj["mobileVerified"] = false;
        userObj["role"] = "user";

        UserModel
        .create(userObj, (error, result)=>{
            if(error){
                sendResponse.serverError(response);
            }
            else{
                const messenger = utils.messenger;

                messenger.createMsg({
                    "to": result.temporaryMobile
                },"OTP");
                sendResponse.success(response, msg.successlfulRegister);
            }
        });
    }

};