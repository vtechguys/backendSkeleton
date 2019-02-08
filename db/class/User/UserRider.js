const User = require('./User');
const utils = require('../../../utils');
const valdate = utils.validate;

class UserRider extends User{
    constructor(){
        super( "user");
    }

    static $createDbObj(obj){
        let dbObj;
        try{
            dbObj = super.$createDbObjBase(obj);
        }
        catch(exp){
            throw exp;
        }


        
    }
}
module.exports = UserRider;