'use strict'
const utils = require('../../utils');
const _ = utils.loadash;
const validate = utils.validate;
const sendResponse = utils.sendResponse;
const encrypt = utils.encrypt;


const config = require('../../config');
const msg = config.msg;
const appConstants = config.constants;

const logger = config.logger;

const dbOperations = require("../../db/crudOperation/user");


function loginValidate(info){
    logger.debug("login credentails validation - loginValidate");
    const errors = {};
    if(info){
        let isValidLoginId = false;
        let isValidPassword = false;
        if(!info.loginId){
            errors["loginId"] = msg.loginIdRequired;
        }
        else{
            if( info.loginId && ( validate.email(info.loginId) || validate.username(info.loginId) ) ){
                isValidLoginId = true;
            }
            if(!isValidLoginId){
                errors["loginId"] = msg.loginIdInvalid;
            }
        }
        if(!info.password){
            errors["password"] = msg.passwordRequired;
        }
        else{
            if( info.password && ( validate.password(info.password)) ){
                isValidPassword = true;
            }
            if(!isValidPassword){
                errors["password"] = msg.passwordInvalid;
            }
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

function login(request, response){
    logger.debug("login request handler.");
    const body = _.pick(request.body, ["loginId", "password", "rememberMe"]);

    const { errors, isValid } = loginValidate( body );

        if(!isValid){
            logger.debug("login credentials invalid.");
            sendResponse.badRequest(response, msg.badRequest, undefined, errors);
        }
        else{
            logger.debug("login credentials valid.");
            
            if(body.rememberMe === true){
                body.rememberMe = true;
            }
            else{
                body.rememberMe = false;
            }

            dbOperations.findByEmailOrUsername(body, function findByEmailOrUsernameCallback(error, queryResult) {
                if(error){
                    logger.error(error);
                    sendResponse.serverError(repsonse);
                }
                else{
                    if(!queryResult){
                        logger.debug("login find no query results.");
                        let errors = {
                            loginId: msg.userNotFound
                        };
                        sendResponse.notFound(response, msg.userNotFound, undefined, errors);
                    }
                    else{
                        let dbpassword = queryResult.password;
                        let salt = queryResult.salt;
                        // find hash of password coming in request
                        let hashOfIncomingPassword = encrypt.sha512(body.password, salt).hash;

                        if(hashOfIncomingPassword === dbpassword){
                            // convert to js obj to del some properties.
                            const userData = result.toObject();
                            // !password hash and salt cannot be exposed!
                            delete userData.password;
                            delete userData.salt;
                            // Now leftover data is safe to send
                            login.debug("login successfull");

                            // remeber Me for longer session
                            userData.rememberMe = body.rememberMe;
                            // create session, hide and remove any sensetive data.
                            dbOperations.createSession(userData, function createSessionCallback(error1, queryResult1){
                                if(error1){
                                    logger.error(error1);
                                    sendResponse.serverError(error1);
                                }
                                else{
                                    if(!queryResult1){
                                        console.log("ridiculus ???");
                                        sendResponse.badRequest(response, "UNABLE TO CREATE SESSION.");
                                    }
                                    else{
                                        const data = {
                                            profile: queryResult1
                                        };
                                        sendResponse.success(response, msg.successlfullogIn, data);

                                    }

                                }
                            });


                        }
                        else{
                            let errors = {
                                password: msg.passwordIncorrect
                            };
                            login.debug("login password mismatch");
                            sendResponse.unauthorized(response, msg.passwordIncorrect, undefined, errors);
                        }
                    }
                }
            });
        }


};

function makeBasicUserObject(body){
        logger.debug("register make user data object");
        const encrypt = utils.encrypt;

        const userObj = {};

        userObj["userId"] = generate.randomString(appConstants.USER_ID_LENGTH);

        userObj["firstName"] = body.firstName;
        userObj["lastName"] = body.lastName;
        
        userObj["email"] = body.email;
        userObj["emailVerified"] = false;
        
        userObj["countryCode"] = body.code;
        userObj["temporaryMobile"] = body.mobile;
        userObj["mobileVerified"] = false;

        userObj["salt"] = encrypt.genRandomString(appConstants.PASSWORD_SALT_LENGTH);
        userObj["password"] = encrypt.sha512( body.password, userObj["salt"]).hash;



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

// exports.registerVender = function(request, response){
//     const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName", "adharNo", "panNo", "voterIdNo"]);
//     const { errors, isValid } = registerValidate(body);

//     if(!isValid){
//         sendResponse.badRequest(response, msg.badRequest, undefined, errors);
//     }
//     else{
//         let userObj = registerBasics(body);
//         userObj["temporaryRole"] = "vender";

//         UserModel
//         .findOne({
//             "$or":[
//                 { "temporaryMobile": body.mobile },
//                 { "mobile": body.mobile },
//                 { "email": body.email }
//             ]
//         })
//         .exec((error, result)=>{
//             if(error){
//                 sendResponse.serverError(response);
//             }
//             else{
//                 if(result && result.userId){
//                     sendResponse.unauthorized(repsonse, msg.accountDuplicate);
//                 }
//                 else{
//                     UserModel
//                     .create(userObj, (error1, result1)=>{
//                         if(error1){
//                             sendResponse.serverError(error1);
//                         }
//                         else{
//                             let userData = result1.toObject();
//                             delete userData.password;
//                             delete userData.salt;
//                             //create jwt token here..
//                             sendResponse.success(response, msg.successlfullRegister, { "profile": userData });
//                         }
//                     });
//                 }
//             }
//         });
//     }

// };
// /**
//  * @params code, mobile, password, email, firstName, lastName
//  * @access Driver, Vender, Admin
//  */
// exports.registerDriver = function(request, response){
//     const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName", "adharNo", "panNo", "voterIdNo"]);
//     const { errors, isValid } = registerValidate(body);

//     if(!isValid){
//         sendResponse.badRequest(response, msg.badRequest, undefined, errors);

//     }
//     else{
//         let userObj = registerBasics(body);
//         userObj["temporaryRole"] = "driver";

//     }

// };
/**
 * @params request, rsponse
 * @access Public
 */
function register(request, response){
    logger.debug("register request handler");
    const body = _.pick(request.body,["code", "mobile", "password", "email", "firstName", "lastName"]);
    
    const { errors, isValid } = registerValidate(body);

    if(!isValid){
        logger.debug("register credentials invalid");
        sendResponse.badRequest(response, msg.badRequest, undefined, errors);
    }
    else{
        logger.debug("register credentials valid");
        let userObj = makeBasicUserObject(body);
        userObj["role"] = "guest"; // mobile number || email not verified
        dbOperations.checkAndRegisterUser(userObj, function checkAndRegisterUserCallback(error, queryResult){
            if(error){
                logger.error(error);
                sendResponse.serverError(response);
            }
            else {

            }
        });

    }

}

// function registerValidateViaOTP(info){
//     const errors = {};

//     if(info && Object.keys(info) > 0){
//         let isValidMobileNo = false;
//         let isValidCode = false;
//         if(info.mobile || info.mobile===""){
//             isValidMobileNo = validate.mobile(info.mobile);
//             if(!isValidMobileNo){
//                 errors["mobile"] = msg.mobileInvalid;
//             }
//         }
//         else{
//             errors["mobile"] = msg.mobileRequired;
//         }

//         if(info.code || info.code === ""){
//             isValidCode = validate.code(info.code);
//             if(!isValidCode){
//                 errors["code"] = msg.codeInvalid;
//             }
//         }
//         else{
//             errors["code"] = msg.codeRequired;
//         }
//     }
//     else{

//     }

//     return {
//         errors: errors,
//         isValid: _.isEmpty(errors)
//     }
// };


// /**
//  * @access User only
//  */
// exports.registerViaOTP = function(request, response){
//     const body = _.pick( request.body, ["mobile"]);
//     const { errors, isValid } = registerValidateViaOTP(body);
//     if(!isValid){
//         sendResponse.badRequest(response, msg.badRequest, undefined, errors);

//     }
//     else{
//         const userObj = {};

//         const utils = require('../../utils');
//         const encrypt = utils.encrypt;
//         const generate = utils.generate;

//         userObj["userId"] = generate.randomString(appConstansts.USER_ID_LENGTH);

//         userObj["salt"] = encrypt.genRandomString(appConstansts.PASSWORD_SALT_LENGTH);
//         userObj["password"] = encrypt.sha512(generate.randomString(10), salt);

//         userObj["temporaryMobile"] = body.mobile;
//         userObj["mobileVerified"] = false;
//         userObj["role"] = "user";

//         UserModel
//         .create(userObj, (error, result)=>{
//             if(error){
//                 sendResponse.serverError(response);
//             }
//             else{
//                 const messenger = utils.messenger;

//                 messenger.createMsg({
//                     "to": result.temporaryMobile
//                 },"OTP");
//                 sendResponse.success(response, msg.successlfulRegister);
//             }
//         });
//     }

// };

function registerWithGoogle(){

}
function registerWithFacebook(){

}
function loginWithGoogle(){

}
function loginWithFacebook(){

}








module.exports = {
    
    

};