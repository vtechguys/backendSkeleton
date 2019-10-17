
'use strict'


function defaultResonseObj(msg, data = null, errors = null) {
    return {
        message: msg,
        data: data,
        errors: errors
    };
}

const responser = {
    badRequest(response, message = "Bad request.", data = null, errors = null) {
        const responseObj = defaultResonseObj(message, data, errors);

        responseObj.code = 400;

        response.json(responseObj);

    },
    serverError(response, message = "Some Error Occured.", data = null, errors = null) {
        const responseObj = defaultResonseObj(message, data, errors);
        responseObj.code = 500;
        response.json(responseObj);
    },
    notFound(response, message = "Not found.", data = null, errors = null) {
        const responseObj = defaultResonseObj(message, data, errors);
        responseObj.code = 404;
        response.json(responseObj);
    },
    unauthorized(response, message = "Unauthorized.", data = null, errors = null) {
        const responseObj = defaultResonseObj(message, data, errors);
        responseObj.code = 401;
        response.json(responseObj);
    },
    success(response, message = "Success.", data = null, errors = null) {
        const responseObj = defaultResonseObj(message, data, errors);
        responseObj.code = 200;
        response.json(responseObj);
    },
    directSendJSON(response, responseObj){
        response.json(responseObj);
    }
};
module.exports = responser;