'use strict'

const express = require('express');
const router = express.Router();

const RoleController = require('../../controllers/Role');

router.get('/fetch-roles', RoleController.roleGetAllRolesRouteHandler);
router.get('/fetch-all-rights', RoleController.roleGetRightsRouteHandler);

router.post('/fetch-role',  RoleController.roleGetThisRoleHandler);
router.post('/create-role', RoleController.roleCreateRoleRouteHandler);
router.post('/delete-role', RoleController.roleDeleteRoleRouteHandler);
router.post('/assign-role', RoleController.roleAssignRoleRouteHandler);
router.post('/fill-rights', RoleController.roleFillRightsRouteHandler);

module.exports = router; 