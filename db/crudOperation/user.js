"use strict";
const User = require("../schema/User");
const {
  logger,
  sendResponse,
  session,
  encrypt,
  mailer,
  generate,
  validate
} = require("../../utils");
const { generateUserId, encryptedPasswordAndHash } = require("../functions");
const { TOKEN_TIME_STAMP } = require('../../config');
const dbOperations = {
  doLogin(body, response) {
    logger.debug("USER_CRUD doLogin");
    const context = this;
    context.findByEmailUsername(
      body.loginId,
      function doLoginDbCb1(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (!result) {
            return sendResponse.notFound(response, msg.userNotFound);
          } else {
            const passwordHash = encrypt.sha512(body.password, result.salt)
              .hash;
            if (passwordHash != result.password) {
              return sendResponse.unauthorized(response, msg.passwordIncorrent);
            } else {
              return session.fillJwtSession(result, response);
            }
          }
        }
      },
      false
    );
  },
  register(body, response) {
    logger.debug("USER_CRUD register this user");
    const MinimalProjection = {
      _id: 1,
      userId: 1,
      email: 1,
      username: 1
    };
    const context = this;
    context.findByEmail(
      body.email,
      function registerDbCb(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (result) {
            return sendResponse.badRequest(response, msg.emailAlreadyTaken);
          } else {
            context.findByUsername(body.username, function registerDbCb2(
              error2,
              result2
            ) {
              if (error2) {
                logger.error(error2);
                return sendResponse.serverError(response);
              } else {
                if (result2) {
                  return sendResponse.badRequest(
                    response,
                    msg.usernameAlreadyTaken
                  );
                } else {
                  const saltAndHash = encryptedPasswordAndHash(body.password);
                  body.password = saltAndHash.hash;
                  body.salt = saltAndHash.salt;
                  body.role = "guest";

                  const token = (body.emailToken = generate.randomString(8));
                  body.emailTokenTimeStamp = Date.now()  + TOKEN_TIME_STAMP;

                  context.createUser(body, function registerDbCb3(
                    error3,
                    result3
                  ) {
                    if (error3) {
                      logger.error(error3);
                      return sendResponse.serverError(response);
                    } else {
                      const mailObject = {
                        userId: result3.userId,
                        email: result3.email,
                        token: token
                      };
                      mailer.createMail(
                        mailObject,
                        mailer.mailTypes.ACCOUNT_ACTIVATION_LINK
                      );

                      return sendResponse.success(
                        response,
                        msg.registeredSuccessfully
                      );
                    }
                  });
                }
              }
            });
          }
        }
      },
      MinimalProjection
    );
  },
  findByEmailUsername(loginId, callback, projections = {}, isVisible = true) {
    logger.debug("USER_CRUD findByEmailOrUsername");
    const context = this;
    const queryMatch = [];
    if (validate.email(loginId)) {
      queryMatch.push({
        email: loginId
      });
    } else if (validate.mobile(loginId)) {
      queryMatch.push(
        {
          mobile: loginId
        },
        {
          temporaryMobile: loginId
        }
      );
    } else if (validate.username(loginId)) {
      queryMatch.push({
        username: loginId
      });
    } else {
      return callback("Error", null);
    }

    let QUERY = {};
    if (queryMatch && queryMatch.length === 1) {
      QUERY = queryMatch[0];
    } else {
      QUERY.$or = queryMatch;
    }
    QUERY.isVisible = isVisible;
    return context.findUserForThisQuery(QUERY, projections, callback);
  },
  findUserForThisQuery(Query = {}, Projection = {}, callback) {
    logger.debug("USER_CRUD findUserForThisQuery");
    User.findOne(Query, Projection).exec(function findUserForThisQueryDbCb(
      error,
      queryResult
    ) {
      if (error) {
        return callback(error, null);
      } else {
        if (queryResult && queryResult._id) {
          return callback(null, queryResult);
        } else {
          return callback(null, null);
        }
      }
    });
  },
  createUser(userData, callback) {
    logger.debug("USER_CRUD createUser");
    userData.userId = generateUserId(userData);
    User.create(userData, function createUserDbCb(error, result) {
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, result);
      }
    });
  },
  findByEmail(email, callback, projections = {}) {
    logger.debug("USER_CURD findByEmail");
    const context = this;
    const QUERY = {
      email: email
    };
    return context.findUserForThisQuery(QUERY, projections, callback);
  },
  findByUsername(username, callback, projections = {}) {
    logger.debug("USER_CURD findByUsername");
    const context = this;
    const QUERY = {
      username: username
    };
    return context.findUserForThisQuery(QUERY, projections, callback);
  },
  findByMobile(mobile, callback, projections = {}) {
    const context = this;
    const FIND_QUERY = {
      $or: [
        {
          mobile: mobile
        },
        {
          temporaryMobile: mobile
        }
      ]
    };
    return context.findUserForThisQuery(FIND_QUERY, projections, callback);
  },
  resetPassword(loginId, password, callback) {
    logger.debug("User_CRUD resetPassword");

    const QUERY = {
      userId: loginId
    };
    const saltAndHash = encryptedPasswordAndHash(password);
    const UPDATE_QUERY = {
      $set: {
        password: saltAndHash.hash,
        salt: saltAndHash.salt
      },
      $unset: {
        passwordToken: 1,
        passwordTimeStamp: 1
      }
    };
    User.findOneAndUpdate(QUERY, UPDATE_QUERY).exec(function resetPasswordDbCb(
      error,
      result
    ) {
      if (error) {
        return callback(error, null);
      } else {
        return callback(null, result);
      }
    });
  },
  findByUserId(userId, callback, projections = {}) {
    logger.debug("User_CRUD findByUserId");
    const context = this;
    const QUERY = {
      userId: userId
    };
    return context.findUserForThisQuery(QUERY, projections, callback);
  },
  _assignRole(userId, role, callback) {
    logger.debug("User_CRUD assignRole");
    const context = this;
    const USER_QUERY = {
      userId: userId,
      role: {
        $ne: "superadmin"
      }
    };
    const UPDATE_QUERY = {
      $set: {
        role
      }
    };
    return context.getOneUserAndUpdateFields(
      USER_QUERY,
      UPDATE_QUERY,
      callback
    );
  },
  getOneUserAndUpdateFields(FIND_QUERY, UPDATE_QUERY, callback, options = {}) {
    User.findOneAndUpdate(FIND_QUERY, UPDATE_QUERY, options).exec(
      function getOneUserAndUpdateFieldsCb(error, result) {
        if (error) {
          return callback(error, null);
        } else {
          if (!result) {
            return callback(null, null);
          } else {
            return callback(null, result);
          }
        }
      }
    );
  },
  setVerified(userId, verified, callback) {
    const context = this;
    const setField = {};
    const unsetFieds = {};
    if (verified === "email") {
      setField.emailVerified = true;
      unsetFieds.emailTokenTimeStamp = 1;
      unsetFieds.emailToken = 1;
    } else if (verified === "mobile") {
      setField.mobileVerified = true;
      unsetFieds.mobileTokenTimeStamp = 1;
      unsetFieds.mobileToken = 1;
      unsetFieds.temporaryMobile = 1;
    }
    const FIND_QUERY = {
      userId: userId
    };
    const UPDATE_QUERY = {
      $set: setField,
      $unset: unsetFieds
    };
    return context.getOneUserAndUpdateFields(
      FIND_QUERY,
      UPDATE_QUERY,
      callback
    );
  },
  setEmailVerified(userId, callback) {
    const context = this;
    return context.setVerified(userId, "email", callback);
  },
  setMobileVerified(userId, callback) {
    const context = this;
    return context.setVerified(userId, "mobile", callback);
  },
  addToken(userId, type, callback) {
    const context = this;
    const TOKEN_LENGTH = 8;
    const { generate } = require("../../utils");
    const token = generate.randomString(TOKEN_LENGTH);
    const setFields = {};
    if (type === "email") {
      setFields.emailToken = token;
      setFields.emailTokenTimeStamp = new Date();
    } else if (type === "mobile") {
      setFields.mobileToken = token;
      setFields.mobileTokenTimeStamp = new Date();
    } else if (type === "password") {
      (setFields.passwordToken = generate.randomString(TOKEN_LENGTH)),
        (setFields.passwordTimeStamp = new Date());
    }

    const FIND_QUERY = {
      userId: userId
    };
    const UPDATE_QUERY = {
      $set: setFields
    };
    return context.getOneUserAndUpdateFields(
      FIND_QUERY,
      UPDATE_QUERY,
      callback
    );
  },
  addPasswordToken(userId, callback) {
    const context = this;
    return context.addToken(userId, "password", callback);
  },
  addEmailToken(userId, callback) {
    const context = this;
    return context.addToken(userId, "email", callback);
  },
  addMobileToken(userId, callback) {
    const context = this;
    return context.addToken(userId, "mobile", callback);
  }
};
module.exports = dbOperations;
