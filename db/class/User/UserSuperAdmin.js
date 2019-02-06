const User = require('./User');

const config = require('../../../config');
const logger = config.logger;


class UserSA extends User{
    constructor(userId, email, ){
        super(userId, email,"superadmin");
    }
    // static $createNewObj(prototypeObj){
    //     return {

    //     }
    // }
    static $createDbObj(obj){    
        logger.debug('userSA createDbObj');
        let dbObj;
        try{
            dbObj = User.$createDbObjBase(obj);
        }
        catch(exp){
            throw exp;
        }
        return dbObj;
    }
}
module.exports = UserSA;