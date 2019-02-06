const config = require('../../../config');
const appConstants = config.constants;
const utils = require('../../../utils');
const validate = utils.validate;
const encrypt = utils.encrypt;


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

    encryptPassword(password=""){

        if(!validate.password(password)){
            throw new Error(`password ${password} is not valid.`);
        }

        const salt = encrypt.genRandomString(appConstants.PASSWORD_SALT_LENGTH);
        const encryptedPassword = encrypt.sha512(password, salt);

        this.salt = salt;
        this.password = encryptedPassword;



    }


    $createDbObj(obj){
        let dbObj = obj;

        if(!validate.email(obj.email)){
            throw new Error(`email ${obj.email} is not valid.`);
        }
        if(!validate.id(obj.userId)){
            throw new Error(`userId ${obj.userId} is not valid.`);
        }
        if(!validate.password(obj.password)){
            throw new Error(`password ${obj.password} is not valid.`);
        }

        if(!validate.string(obj.salt)){
            throw new Error(`salt ${obj.salt} is not valid.`);
        }
        
        return dbObj;
    }

}

module.exports = User;