
'use strict'



const msgConfig = {

    loginIdInvalid: "loginId is invalid",
    loginIdReqquired: "loginId is required.",

    passwordInvalid: "password is invalid.",
    passwordRequired: "password is required",
    passwordIncorrect: "password is incorrect",

    successlfullogIn: "successfully logedin",
    userNotFound: "user with this loginId not found",

    codeInvalid: "code is invalid",
    codeRequired: "code is required.",

    mobileInvalid: "mobile is invalid",
    mobileRequired: "mobile is required",

    firstNameInvalid: "firstName is invalid",
    firstNameRequired: "firstName is requried",


    lastNameInvalid: "lastName is invalid",
    lastNameRequired: "lastName is requried",

    emailInvlaid: "email is invalid",
    emailRequired: "email is required",

    accountDuplicate: "A account with this mobile or email already exist",




    //Errors.............

        //400
        badRequest: 'Invalid Inputs',
        //404
        unknown: 'Not found',
        //403
        forbidden: 'Resource forbidden',
        //402
        paymentRequired: 'Payment required',
        //401
        unauthorised: 'Unauthorised',
        //416
        unsuported: 'Media type not supported.',
        
        //500
        serverError: 'Some Error Occured.Try again later.',
        //504
        timeOut: 'Gateway timeout occured',
};
module.exports = msgConfig;
