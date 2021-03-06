"use strict";

const msg = require("../msgConfig");

const { logger, sendResponse, loadash, validate } = require("../../utils");
const {} = require("../../db/functions");
const { auth, ALL_ROLES } = require("../../config/roleUrls/registeredUrls");

const dbOperations = require("../../db/crudOperation/role");

function roleGetRightsRouteHandler(request, response) {
  const data = {
    urls: auth
  };
  return sendResponse.success(response, msg.getRight, data);
}

function roleGetRightForThisRoute(request, response) {
  const userData = request.userData;
  const body = _.pick(request.body, ["role"]);
}
function roleGetAllRolesRouteHandler(request, response) {
  logger.debug("route api roleGetAllRolesRouteHandler");
  const PROJECTIONS = {
    rights: 0
  };
  dbOperations.getRoles(function getAllRolesCbRoute(error, results) {
    if (error) {
      return sendResponse.badRequest(response);
    } else {
      if (results && results.length === 0) {
        return sendResponse.notFound(response, msg.rolesNotFound);
      } else {
        const data = {
          roles: results
        };
        return sendResponse.success(response, msg.rolesFound, data);
      }
    }
  }, PROJECTIONS);
}

function validateRoleInputs(inputs) {
  const errors = {};
  if (inputs.role) {
    if (ALL_ROLES.indexOf(inputs.role) === -1) {
      errors.role = msg.roleNotRecognized;
    }
  } else {
    errors.role = msg.roleRequired;
  }

  return {
    isValid: loadash.isEmpty(errors),
    errors
  };
}

function validateGetRoleInputs(inputs) {
  return validateRoleInputs(inputs);
}
/**
 * get alll roles except superadmin
 */
function roleGetThisRoleHandler(request, response) {
  logger.debug("roles api roleGetThisRoleHandler");
  const body = loadash.pick(request.body, ["s"]);

  const { isValid, errors } = validateGetRoleInputs(body);

  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputErrors, errors);
  } else {
    if (body.role === "superadmin") {
      return sendResponse.unauthorized(response, msg.roleNotFound);
    } else {
      dbOperations.getRole(body.role, function getRoleCbRoute(error, result) {
        if (error) {
          logger.error(error);
          return sendResponse.serverError(response);
        } else {
          if (!result) {
            return sendResponse.notFound(response, msg.roleNotFound);
          } else {
            const data = {
              role: result
            };
            return sendResponse.success(response, msg.roleFound, data);
          }
        }
      });
    }
  }
}

function validateCreateRoleInputs(inputs) {
  return validateRoleInputs(inputs);
}
function roleCreateRoleRouteHandler(request, response) {
  logger.debug("CONTROLLER roleCreateRoleRouteHandler");
  const body = loadash.pick(request.body, ["role"]);

  const { isValid, errors } = validateCreateRoleInputs(body);

  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputErrors, errors);
  } else {
    if (body.role === "superadmin") {
      return sendResponse.unauthorized(response, msg.oneSuperAdmin); // roles are unique this fill fail anyway
    } else {
      dbOperations.getRole(body.role, function createRoleCbRoute1(
        error1,
        result1
      ) {
        if (error1) {
          logger.error(error1);
          return sendResponse.serverError(response);
        } else {
          if (result1 && result1.roleId) {
            return sendResponse.badRequest(response, msg.roleAlreadyExist);
          } else {
            dbOperations.createRole(body.role, function createRoleCbRoute2(
              error2,
              result2
            ) {
              if (error2) {
                logger.error(error2);
                return sendResponse.serverError(response);
              } else {
                const data = {
                  role: result2
                };
                return sendResponse.success(
                  response,
                  msg.successCreateRole,
                  data
                );
              }
            });
          }
        }
      });
    }
  }
}

function validateAssignRoleInputs(inputs) {
  const errors = {};
  if (inputs.userId) {
    if (!validate.id(inputs.userId)) {
      errors.userId = msg.userIdInvalid;
    }
  } else {
    errors.userId = msg.userIdRequired;
  }
  if (inputs.role) {
    if (ALL_ROLES.indexOf(inputs.role) === -1) {
      errors.role = msg.roleNotRecognized;
    }
  } else {
    errors.role = msg.roleRequired;
  }

  return {
    isValid: loadash.isEmpty(errors),
    errors
  };
}
function roleAssignRoleRouteHandler(request, response) {
  logger.debug("ROLE_CONTROLLER roleAssignRoleRouteHandler");
  const INPUTS = ["userId", "role"];
  const body = loadash.pick(request.body, INPUTS);
  const { isValid, errors } = validateAssignRoleInputs(body);
  if (!isValid) {
    return sendResponse.badRequest(response, msg.inputErrors, errors);
  } else {
    if (body.role == "superadmin" || body.userId == request.userData.userId) {
      // superadmin making himself somthing else :p
      return sendResponse.unauthorized(response, msg.oneSuperAdmin);
    } else {
      const UserCRUD = require("../../db/crudOperation/user");
      const projection = {
        userId: 1,
        _id: 1,
        role: 1
      };
      UserCRUD.findByUserId(
        body.userId,
        function findByUserIdCbRoute(error, result) {
          if (error) {
            logger.error(error);
            return sendResponse.serverError(response);
          } else {
            if (!result) {
              return sendResponse.notFound(response, msg.userNotFound);
            } else {
              if (body.role === result.role) {
                return sendResponse.success(response, msg.userRoleUpdated);
              } else {
                dbOperations.assignRole(
                  result.userId,
                  body.role,
                  function updateRoleCbRoute(error1) {
                    if (error1) {
                      logger.error(error1);
                      return sendResponse.serverError(response);
                    } else {
                      if (!result) {
                        return sendResponse.notFound(
                          response,
                          msg.userNotFound
                        );
                      } else {
                        return sendResponse.success(
                          response,
                          msg.userRoleUpdated
                        );
                      }
                    }
                  }
                );
              }
            }
          }
        },
        projection
      );
    }
  }
}

function validateRoleId(inputs) {
  const errors = {};
  if (inputs.roleId) {
    if (!validate.id(inputs.roleId)) {
      errors.roleId = msg.roleIdInvalid;
    }
  } else {
    errors.roleId = msg.roleIdRequired;
  }

  return {
    isValid: loadash.isEmpty(errors),
    errors
  };
}

function validateDeleteRoleInputs(inputs) {
  return validateRoleId(inputs);
}

function roleDeleteRoleRouteHandler(request, response) {
  logger.debug("ROLE_CONTROLLER roleDeleteRoleRouteHandler");
  const body = loadash.pick(request.body, ["roleId"]);
  const { isValid, errors } = validateDeleteRoleInputs(body);

  if (!isValid) {
    return sendResponse.serverError(response, msg.inputErrors, errors);
  } else {
    dbOperations.deleteRole(body.roleId, function deleteRoleCbRoute(
      error,
      result
    ) {
      if (error) {
        logger.error(error);
        return sendResponse.serverError(response);
      } else {
        if (!result) {
          return sendResponse.notFound(response, msg.roleNotFound);
        } else {
          return sendResponse.success(response, msg.deleteRoleSuccess);
        }
      }
    });
  }
}
function validateFillRightsInputs(inputs) {
  return validateRoleId(inputs);
}

function roleFillRightsRouteHandler(request, response) {
  logger.debug("ROLE_CONTROLLER roleFillRightsRouteHandler");

  const body = loadash.pick(request.body, ["roleId", "rights"]);
  const { isValid, errors } = validateFillRightsInputs(body);

  if (!isValid) {
    return sendResponse.serverError(response, msg.inputErrors, errors);
  } else {
    dbOperations.getRoleById(body.roleId, function getRoleByIdCb(
      error1,
      result1
    ) {
      if (error1) {
        logger.error(error1);
        return sendResponse.serverError(response);
      } else {
        if (!result1) {
          return sendResponse.notFound(response, msg.roleNotFound);
        } else {
          const rightsInputs = body.rights || result1.rights;
          const newRights = [];
          Object.keys(auth).forEach(function(key) {
            for (let i = 0; i < auth[key].length; i++) {
              if (rightsInputs.indexOf(auth[key][i]) > -1) {
                const right = {
                  name: auth[key][i],
                  path: key,
                  url: key + auth[key][i]
                };
                newRights.push(right);
              }
            }
          });

          dbOperations.fillRights(
            body.roleId,
            newRights,
            function fillRightsCbRoute(error2, result2) {
              if (error2) {
                logger.error(error2);
                return sendResponse.serverError(response);
              } else {
                if (!result2) {
                  return sendResponse.notFound(response, msg.roleNotFound);
                } else {
                  return sendResponse.success(response, msg.roleRightsUpdated);
                }
              }
            }
          );
        }
      }
    });
  }
}

module.exports = {
  roleDeleteRoleRouteHandler,
  roleAssignRoleRouteHandler,
  roleCreateRoleRouteHandler,
  roleGetThisRoleHandler,
  roleGetAllRolesRouteHandler,
  roleGetRightsRouteHandler,
  roleFillRightsRouteHandler
};
