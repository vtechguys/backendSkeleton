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
const msg = require("../msgConfig");

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
    dbOperations.addEmailToken(userData.userId, function addEmailTokenDbCb(
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
function profileEmailVerification(request, response) {
  logger.debug("PROFILE_CRUD profileEmailVerification");
  const body = loadash.pick(request.body, PROFILE_EMAIL_VERIFICATION);
  const { isValid, errors } = validateProfileEmailVerificationInputs(body);
  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputsError, errors);
  } else {
    const projectionsFindByEmail = {
      _id: 1,
      userId: 1,
      email: 1
    };
    dbOperations.findByEmail(
      body.email,
      function findByEmailDbCb(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (!result) {
            return sendResponse.notFound(response, msg.userNotFound);
          } else {
            const mailData = {
              userId: userData.userId,
              email: userData.email,
              token: result.emailToken
            };
            dbOperations.addEmailToken(
              result.userId,
              function addEmailTokenDbCb(error1, userData) {
                if (error1) {
                  logger.error(error1);
                  return sendResponse.serverError(response);
                } else {
                  if (!userData) {
                    return sendResponse.notFound(response, msg.userNotFound);
                  } else {
                    const mailData = {
                      userId: userData.userId,
                      email: userData.email,
                      token: userData.emailToken
                    };
                    mailer.createMail(
                      mailData,
                      mailer.mailTypes.ACCOUNT_ACTIVATION_LINK
                    );
                    return sendResponse.success(
                      response,
                      msg.sentEmailVerificationMail
                    );
                  }
                }
              }
            );
          }
        }
      },
      projectionsFindByEmail
    );
  }
}
function validateProfileRegisterMobile(inputs) {
  const errors = {};
  if (inputs) {
    if (!inputs.mobile) {
      errors.mobile = msg.mobileRequired;
    } else {
      if (!validate.mobile(inputs.mobile)) {
        errors.mobile = msg.mobileInvlaid;
      }
    }
  } else {
    errors.mobile = msg.mobileRequired;
  }
  return {
    isValid: loadash.isEmpty(errors),
    errors
  };
}
const PROFILE_REGISTER_MOBILE = ["mobile"];
function profileRegisterMobile(request, response) {
  const body = loadash.pick(request.body, PROFILE_REGISTER_MOBILE);
  const { isValid, errors } = validateProfileRegisterMobile(body);
  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputsError, errors);
  } else {
    const projectionsFindByMobile = {
      _id: 1,
      userId: 1
    };
    dbOperations.findByMobile(
      body.mobile,
      function findByMobileDbCb(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (result) {
            return sendResponse.notFound(
              response,
              msg.mobileNumberAlreadyExist
            );
          } else {
            dbOperations.addMobileNumber(
              result.userId,
              function addMobileNumberDbCb(error1, result1) {
                if (error1) {
                  logger.error(error1);
                  return sendResponse.serverError(response);
                } else {
                  const msgObj = {
                    to: result1.temporaryMobile,
                    token: result1.mobileToken
                  };
                  messenger.createSMS(
                    msgObj,
                    messenger.smsTypes.MOBILE_ACTIVATION
                  );
                  return sendResponse.success(
                    response,
                    msg.mobileNumberNotedVerificationRequired
                  );
                }
              }
            );
          }
        }
      },
      projectionsFindByMobile
    );
  }
}

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
  logger.debug("PROFILE_CRUD profileMobileVerification");
  const body = loadash.pick(request.body, PROFILE_MOBILE_VERIFICATION);
  const { isValid, errors } = validateProfileMobileVerificationInputs(body);
  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputsError, errors);
  } else {
    const projectionsFindByUserId = {
      _id: 1,
      userId: 1,
      mobileTokenTimestamp: 1,
      mobileToken: 1
    };
    const userId = request.userData.userId;
    dbOperations.findByUserId(
      userId,
      function profileMobileVerificationDbCb(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (result.mobileTokenTimestamp - Date.now() <= 0) {
            return sendResponse.badRequest(response, msg.tokenExpired);
          } else {
            if (result.mobileToken !== body.token) {
              return sendResponse.badRequest(response, msg.tokenMismatch);
            } else {
              dbOperations.setMobileVerified(
                userId,
                function setMobileVerifiedDbCb(error1) {
                  if (error1) {
                    logger.error(error1);
                    return sendResponse.serverError(response);
                  } else {
                    return sendResponse.success(response, msg.mobileVerified);
                  }
                }
              );
            }
          }
        }
      },
      projectionsFindByUserId
    );
  }
}
function profileRequestMobileVerification(request, response) {
  const userId = request.userData.userId;
  dbOperations.addMobileToken(userId, function addMobileTokenDbCb(
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
        const msgObj = {
          to: result.mobile || result.temporaryMobile,
          token: result.mobileToken
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
  profileRequestEmailVerification,
  profileEmailVerification
};
