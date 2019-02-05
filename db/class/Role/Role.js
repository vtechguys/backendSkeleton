const config = require('../../../config');
const appConstants = config.constants;

class Role {
    constructor(roleId){
        this.roleId = roleId;
        
    }
    $setRole(role){
        if(!appConstants.ALL_ROLES.includes(role)){
            throw new Error('role is not valid', appConstants.ALL_ROLES);
        }
        this.role = role;
    }
}
module.exports = Role;