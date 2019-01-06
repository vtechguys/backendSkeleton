'use strict'

const message = {
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

    //server error

    //500
    serverError: 'Some Error Occured.Try again later.',
    //504
    timeOut: 'Gateway timeout occured'
};




const LOGIN = {
    emailInvalid: "Email is invalid.",
    emailRequired: "Email is required.",
    emailDoesNotExist: "User with this mail doesnot exist.",

    passwordInvalid: "Password is invalid.",
    passwordRequired: "Password is required.",
    passwordIncorrect: "Password is incorrect.",

    successlogIn: "Logged In successfully."
    
};




const msgConfig = {
    logIn: LOGIN
};
module.exports = msgConfig;