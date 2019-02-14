
'use strict'

const config = require('../../config');
const responseTypes = config.responseTypes;


const responser = {
    badRequest(response, message = "Bad request", data = undefined, errors = undefined){

    },
    serverError(response, message = "Some Error Occured!", data = undefined, errors = undefined){

    },
    notFound(response, message = "Not found", data = undefined, errors = undefined){

    },
    unauthorized(response, message = "Unauthorized.", data = undefined, errors = undefined){

    },
    success(response, message = "Unauthorized.", data = undefined, errors = undefined){

    }
};
module.exports = responser;