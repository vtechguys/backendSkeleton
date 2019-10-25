'use strict'

const express = require('express');
const router = express.Router();

const RoleController = require('../../controllers/Role');

router.post('/get-roles', RoleController.roleGetAllRolesRouteHandler);
router.post('/get-role', RoleController.roleGetThisRoleHandler);
router.post('/create-role', RoleController.roleCreateRoleRouteHandler);
router.post('/delete-role', RoleController.roleDeleteRoleRouteHandler);
router.post('/assign-role', RoleController.roleAssignRoleRouteHandler);
router.post('/fill-rights', RoleController.roleFillRightsRouteHandler);

module.exports = router; 