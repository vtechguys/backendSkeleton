"use strict";

const dbOperations = require("../../db/crudOperation/user");
const {
  sendResponse,
  logger,
  mailer,
  messenger,
  validate,
  loadash
} = require("../../utils");
const msg = require("./msgconfig");


function validateProfileEmailVerificationInputs(inputs) {
    const errors = {};
    if (inputs.token) {
      if (!validate.id(inputs.token)) {
        errors.token = msg.tokenInvalid;
      }
    } else {
      errors.token = msg.tokenRequired;
    }
    if (inputs.email) {
        if (!validate.email(inputs.email)) {
          errors.email = msg.emailInvalid;
        }
      } else {
        errors.email = msg.emailRequired;
      }
    return {
      isValid: loadash.isEmpty(errors),
      errors
    };
  }
function profileRequestEmailVerification(request, response) {
  const userData = request.userData;

  if (userData.emailVerified) {
    return sendResponse.badRequest(response, msg.emailAlreadyVerified);
  } else {
    dbOperations.addEmailToken(userData.userId, function addEmailTokenCbRoute(
      error,
      result
    ) {
      if (error) {
        logger.error(error);
        return sendResponse.serverError(response);
      } else {
        const mailData = {
          userId: userData.userId,
          email: userData.email,
          token: result.emailToken
        };
        mailer.createMail(mailData, mailer.mailTypes.ACCOUNT_ACTIVATION_LINK);
        return sendResponse.success(response, msg.sentEmailVerificationMail);
      }
    });
  }
}
const PROFILE_EMAIL_VERIFICATION = ["token"];
function profileEmailVerification(request, response){
    const body = loadash.pick(request.body, PROFILE_EMAIL_VERIFICATION);
    const {isValid, errors} = validateProfileEmailVerificationInputs(body);
    if(!isValid){
        return sendResponse.badRequest(response,msg.inputsError, errors);
    }
    else{
        dbOperations.findByEmail(body.email)
    }
}
function profileRegisterMobile(request, response) {}


function validateProfileMobileVerificationInputs(inputs) {
  const errors = {};
  if (inputs.token) {
    if (!validate.id(inputs.token)) {
      errors.token = msg.tokenInvalid;
    }
  } else {
    errors.token = msg.tokenRequired;
  }
  return {
    isValid: loadash.isEmpty(errors),
    errors
  };
}
const PROFILE_MOBILE_VERIFICATION = ["token"];
function profileMobileVerification(request, response) {
  const body = loadash.pick(request.body, PROFILE_MOBILE_VERIFICATION);
  const { isValid, errors } = validateProfileMobileVerificationInputs(body);
  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputsError, errors);
  } else {
    const userId = request.userData.userId;
    dbOperations.findByUserId(userId, function profileMobileVerification(
      error,
      result
    ) {
      if (error) {
        return sendResponse.serverError(response);
      } else {
        if (result.mobileTokenTimestamp - Date.now() <= 0) {
          return sendResponse.badRequest(response, msg.tokenExpired);
        } else {
          if (result.mobileToken !== body.token) {
            return sendResponse.badRequest(response, msg.tokenMismatch);
          } else {
            dbOperations.setMobileVerified(userId, function setMobileVerifiedCbRoute(error1){
                if(error1){
                    return sendResponse.serverError(response);
                    
                }
                else{
                    return sendResponse.success(response, msg.mobileVerified);
                }
            });
          }
        }
      }
    });
  }
}
function profileRequestMobileVerification(request, response) {
  const userId = request.userData.userId;
  dbOperations.addMobileToken(userId, function addMobileTokenCbRoute(
    error,
    result
  ) {
    if (error) {
      logger.error(error);
      return sendResponse.serverError(response);
    } else {
      if (!result) {
        return sendResponse.notFound(response, msg.userNotFound);
      } else {
        // token added successfully now send otp

        const msgObj = {
          to: result.mobile || result.temporaryMobile,
          otp: result.mobileToken
        };
        messenger.createSMS(msgObj, messenger.smsTypes.MOBILE_ACTIVATION);
        return sendResponse.success(response, msg.mobileNumberNoted);
      }
    }
  });
}

module.exports = {
    profileMobileVerification,
    profileRequestMobileVerification,
    profileRegisterMobile,
    profileRequestEmailVerification
};
