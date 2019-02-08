const User = require('./User');


class UserAdmin extends User{
    constructor(){
        super("admin");
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
module.exports = UserAdmin;