'use strict'

const utils = require('../../utils');
const sendResponse = utils.sendResponse;
const validate = utils.validate;
const _ = utils.lodash;

function loginValidate(){
     
    return {

    }
}


const doLogin = (request, response) => {
    let loginObj = {
        "loginId": request.body.loginId,
        "password": request.body.password
    };

    const { errors, isValid } = loginValidate(loginObj);

    if(!isValid){

    }
    else{

    }


};


const routesController = {};


module.exports = routesController; 