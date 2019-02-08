const config = require('../../../config');
const logger = config.logger;
const appConstants = config.constants;
const utils = require('../../../utils');
const validate = utils.validate;
const encrypt = utils.encrypt;




class User{
    constructor(role){
        this.role = role || "user";
        if(!this.userId){
            const utils = require('../../../utils');
            const generate = utils.generate;
            let userId = generate.randomString(appConstants.USER_ID_LENGTH);
            this.userId = userId;
        }    
    }

    $setFirstName(firstName){
        this.firstName = firstName;
    }
    $setEmailVerified(verified){
        this.emailVerified = verified;
    }
    $setLastName(lastName){
        this.lastName = lastName;
    }
    $setRole(role){
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
    encryptPassword(password){
        if(!password){
            return;
        }
        

        const salt = encrypt.genRandomString(appConstants.PASSWORD_SALT_LENGTH);
        const encryptedPassword = encrypt.sha512(password, salt).hash;

        this.salt = salt;
        this.password = encryptedPassword;



    }
    
    $selectiveUpdate(originalObj, updateObj){
        return {
            ...originalObj,
            ...updateObj
        }
    }
    static $createDbObjBase(obj){
        logger.debug('user createDbObjBase');
       
        if(!validate.id(obj.userId)){
            throw new Error(`userId ${obj.userId} is not valid.`);
        }
        // if(!validate.password(obj.password)){
        //     throw new Error(`password ${obj.password} is not valid.`);
        // }
        if(!obj.password){
            throw new Error(`password ${obj.password} is not valid.`);
        }
        if(typeof(obj.salt)!=="string"){
            throw new Error(`salt ${obj.salt} is not valid.`);
        }
        
        if(!obj.email || !obj.mobile){
            throw new Error(`mobile or email ${this.mobile} or ${this.mobile} required atleat one.`);
        }
        


        return obj;
    }

}

module.exports = User;