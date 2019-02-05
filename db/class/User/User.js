const config = require('../../../config');
const appConstants = config.constants;

class User{
    constructor(userId, email, role){
        this.userId = userId;
        this.email = email;
        this.role = role || "user";
        
    }
    $setFirstName(firstName){
        this.firstName = firstName;
    }
    $setEmailVerified(verified){
        if(typeof(verified)!=="boolean"){
            throw new Error('emailVerified need to be boolean.');
        }
        this.emailVerified = verified;
    }
    $setLastName(lastName){
        this.lastName = lastName;
    }
    $setRole(role){
        if(!appConstants.ALL_ROLES.includes(role)){
            throw new Error('role is not valid',appConstants.ALL_ROLES);
        }
        this.role = role;
    }
    $setEmail(email){
        this.email = email;
    }
    $setPhoneNo(phoneNo){
        this.phoneNo = phoneNo;
    }

}
module.exports = User; 