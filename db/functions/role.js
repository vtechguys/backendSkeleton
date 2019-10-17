'use strict'
const { generate } = require('../../utils');
function assignRoleId(roleObj) {
    roleObj.roleId = generate.randomString(8);
}
function assignRole(roleObj, role) {
    roleObj.role = role;
}
function createTheRole(role = "guest"){
    const roleObj = {};
    assignRoleId(roleObj);
    assignRole(role);
}
module.exports = {
    assignRoleId,
    assignRole,
    createTheRole
};