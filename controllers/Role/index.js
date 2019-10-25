'use strict'

const msg = require('./msgconfig');

const { logger, sendResponse, loadash, validate } = require('../../utils');

const { auth, ALL_ROLES } = require('../../config/roleUrls/registeredUrls');


const dbOperations = require('../../db/crudOperation/role');

function roleGetRightsRouteHandler(request, response) {
    const data = {
        urls: auth
    };
    sendResponse.success(response, msg.getRight, data);
}

function roleGetAllRolesRouteHandler(request, response) {
    dbOperations.getRoles(function getAllRolesCbRoute(error, results) {
        if (error) {
            sendResponse.badRequest(response);
        }
        else {
            if (results && results.length === 0) {
                sendResponse.notFound(response, msg.rolesNotFound);
            }
            else {
                const data = {
                    roles: results
                };
                sendResponse.success(response, msg.rolesFound, data);
            }
        }
    });
}


function validateRoleInputs(body) {
    const errors = {};
    if (body.role) {
        if (ALL_ROLES.indexOf(body.role) === -1) {
            errors.role = msg.roleNotRecognized;
        }
    }
    else {
        errors.role = msg.roleNotFound;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    };
}


function validateGetRoleInputs(body) {
    return validateRoleInputs(body);
}
function roleGetThisRoleHandler(request, response) {
    const body = loadash.pick(request.body, ["role"]);

    const { isValid, errors } = validateGetRoleInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {

        dbOperations.getRole(body.role, function getRoleCbRoute(error, result) {
            if (error) {
                sendResponse.serverError(response);
            }
            else {
                if (!result) {
                    sendResponse.notFound(response, msg.roleNotFound);
                }
                else {
                    const data = {
                        role: result
                    };
                    sendResponse.success(response, msg.roleFound, data);

                }
            }
        });

    }

}



function validateCreateRoleInputs(body) {
    return validateRoleInputs(body);
}
function roleCreateRoleRouteHandler(request, response) {
    const body = loadash.pick(request.body, ["role"]);

    const { isValid, errors } = validateCreateRoleInputs(body);

    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        dbOperations.createRole(body.role, function createRoleCbRoute(error, result) {
            if (error) {
                sendResponse.serverError(response);
            }
            else {
                const data = {
                    role: result
                };
                sendResponse.success(response, msg.successCreateRole, data);
            }
        });
    }

}



function validateAssignRoleInputs(body) {
    const errors = {};
    if (body.userId) {
        if (!validate.id(body.userId)) {
            errors.userId = msg.userIdInvalid;
        }
    }
    else {
        errors.userId = msg.userIdRequired;
    }
    if (body.role) {
        if (ALL_ROLES.indexOf(body.role) === -1) {
            errors.role = msg.roleNotRecognized;
        }
    }
    else {
        errors.role = msg.roleNotFound;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    };

}
function roleAssignRoleRouteHandler(request, response) {
    const INPUTS = ['userId', 'role'];
    const body = loadash.pick(request.body, INPUTS);
    const { isValid, errors } = validateAssignRoleInputs(body);
    if (!isValid) {
        sendResponse.badRequest(response, msg.inputErrors, errors);
    }
    else {
        if (body.role == 'superadmin') {
            sendResponse.unauthorized(response, msg.oneSuperAdmin);
        }
        else {
            const UserCRUD = require('../../db/crudOperation/user');
            const projection = {
                'userId': 1,
                '_id': 1,
                'role': 1
            };
            UserCRUD
                .findByUserId(body.userId, function findByUserIdCbRoute(error, result) {
                    if (error) {
                        sendResponse.serverError(response);
                    }
                    else {
                        if (!result) {
                            sendResponse.notFound(response, msg.userNotFound);
                        }
                        else {
                            if (body.role === result.role) {
                                sendResponse.success(response, msg.userRoleUpdated);
                            }
                            else {
                                dbOperations
                                    .assignRole(result.userId, role, function updateRoleCbRoute(error1) {
                                        if (error1) {
                                            sendResponse.serverError(response);
                                        }
                                        else {
                                            sendResponse.success(response, msg.userRoleUpdated);
                                        }
                                    });
                            }
                        }
                    }
                }, projection);
        }
    }
}


function validateDeleteRoleInputs(inputs) {
    const errors = {};
    if (inputs.roleId) {
        if (!validate.id(inputs.roleId)) {
            errors.roleId = msg.roleIdInvalid;
        }
    }
    else {
        errors.roleId = msg.roleIdRequired;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    }
}



function roleDeleteRoleRouteHandler(request, response) {
    const body = loadash.pick(validateDeleteRoleInputs, ["roleId"]);
    const { isValid, errors } = validateDeleteRoleInputs(body);

    if (!isValid) {
        sendResponse.serverError(response, msg.inputErrors, errors);
    }
    else {
        dbOperations
            .deleteRole(body.roleId, function deleteRoleCbRoute(error) {
                if (error) {
                    sendResponse.serverError(response);
                }
                else {
                    sendResponse.success(response, msg.deleteRoleSuccess);
                }
            });
    }

}
function validateFillRightsInputs() {
    const errors = {};
    if (inputs.roleId) {
        if (!validate.id(inputs.roleId)) {
            errors.roleId = msg.roleIdInvalid;
        }
    }
    else {
        errors.roleId = msg.roleIdRequired;
    }

    return {
        isValid: loadash.isEmpty(errors),
        errors
    }
}

function roleFillRightsRouteHandler(request, response) {
    const body = loadash.pick(validateDeleteRoleInputs, ["roleId", "rights"]);
    const { isValid, errors } = validateDeleteRoleInputs(body);

    if (!isValid) {
        sendResponse.serverError(response, msg.inputErrors, errors);
    }
    else {
        const rightsInputs = body.rights;
        const newRights = [];
        Object.keys(auth).forEach(function (key) {
            for (let i = 0; i < auth[key].length; i++) {
                if (rightsInputs.indexOf(auth[key][i]) > -1) {
                    const right = {
                        name: auth[key][i],
                        path: key,
                        url: key + auth[key][i]
                    }
                    newRights.push(right);
                }
            }
        });

        dbOperations
            .fillRights(body.roleId, newRights, function fillRightsCbRoute(error) {
                if (error) {
                    sendResponse.serverError(response);
                }
                else {
                    sendResponse.success(response, msg.roleRightsUpdated);
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