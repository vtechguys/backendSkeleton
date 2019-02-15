'use strict'
///Response status configs
/**
 * Response code application supports...
 * SUCCESS: 200
 * FAIL: 403
 * UNKNOW: 404
 * UNAUTHORISED: 401
 * BAD_REQUEST: 400
 * 
 */
const msg = require('./msg/index.js');
const responseTypesConfig = {
    SUCCESS: {
        type: "success",
        code: 200,
        defaultMsg: msg.success
    },
    FAIL: {
        type: "fail",
        code: 403,
        defaultMsg: msg.fail
    },
    UNKNOW: {
        type: "fail",
        code: 404,
        defaultMsg: msg.unknown
    },
    UNAUTHORISED:{
        type:  "unauthorised",
        code: 401,
        defaultMsg: msg.unauthorised
    },
    BAD_REQUEST: {
        type: "bad-request",
        code: 400,
        defaultMsg: msg.badRequest
    },

};
module.exports = responseTypesConfig; 