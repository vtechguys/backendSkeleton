const User = require('./User');


class UserSA extends User{
    constructor(userId, email, phoneNo){
        super(userId, email, phoneNo, "superadmin");
    }
}
module.exports = UserSA;