"use strict";

function defaultResonseObj(msg, errors = null, data = null) {
  const res = {
    message: msg,
    success: false
  };
  if (errors) {
    res.errors = errors;
  }
  if (data) {
    res.data = data;
  }
  return res;
}

const responser = {
  badRequest(response, message = "Bad request.", errors = null, data = null) {
    const responseObj = defaultResonseObj(message, errors, data);

    responseObj.code = 400;

    response.json(responseObj);
  },
  serverError(
    response,
    message = "Some Error Occured.",
    errors = null,
    data = null
  ) {
    const responseObj = defaultResonseObj(message, errors, data);
    responseObj.code = 500;
    response.json(responseObj);
  },
  notFound(response, message = "Not found.", errors = null, data = null) {
    const responseObj = defaultResonseObj(message, errors, data);
    responseObj.code = 404;
    response.json(responseObj);
  },
  unauthorized(
    response,
    message = "Unauthorized.",
    errors = null,
    data = null
  ) {
    const responseObj = defaultResonseObj(message, errors, data);
    responseObj.code = 401;
    response.json(responseObj);
  },
  success(response, message = "Success.", data = null, errors = null) {
    const responseObj = defaultResonseObj(message, errors, data);
    responseObj.code = 200;
    responseObj.success = true;
    response.json(responseObj);
  },
  directSendJSON(response, responseObj) {
    response.json(responseObj);
  }
};
module.exports = responser;
