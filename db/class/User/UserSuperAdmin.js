const User = require('./User');

class UserSA extends User{
    constructor(userId, email, ){
        super(userId, email,"superadmin");
    }
    // static $createNewObj(prototypeObj){
    //     return {

    //     }
    // }
    static $createDbObj(obj){        
        let dbObj;
        try{
            dbObj = super.$createDbObj(obj);
        }
        catch(exp){
            throw exp;
        }



        
        return dbObj;
    }
}
module.exports = UserSA;