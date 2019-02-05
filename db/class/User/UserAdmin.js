const User = require('./User');


class UserAdmin extends User{
    constructor(userId, email, phoneNo){
        super(userId, email, phoneNo, "admin");
    }
}
module.exports = UserAdmin;