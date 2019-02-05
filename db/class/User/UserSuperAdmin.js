const User = require('./User');


class UserSA extends User{
    constructor(userId, email, ){
        super(userId, email,"superadmin");
    }
}
module.exports = UserSA;