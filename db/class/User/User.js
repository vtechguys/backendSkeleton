const config = require('../../../config');
const logger = config.logger;
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
        this.emailVerified = false;
    }
    $setPhoneNo(phoneNo){
        this.mobile = phoneNo;
        this.mobileVerified = false;

    }
    encryptPassword(password=""){

        if(!validate.password(password)){
            throw new Error(`password ${password} is not valid.`);
        }

        const salt = encrypt.genRandomString(appConstants.PASSWORD_SALT_LENGTH);
        const encryptedPassword = encrypt.sha512(password, salt).hash;

        this.salt = salt;
        this.password = encryptedPassword;



    }
    static $createDbObjBase(obj){
        logger.debug('user createDbObjBase');
       
        if(!validate.id(obj.userId)){
            throw new Error(`userId ${obj.userId} is not valid.`);
        }
        if((obj.password.length<6)){
            throw new Error(`password ${obj.password} is not valid.`);
        }

        if(typeof(obj.salt)!=="string"){
            throw new Error(`salt ${obj.salt} is not valid.`);
        }
       
        return obj;
    }

}

module.exports = User;