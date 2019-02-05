const User = require('./User');


class UserAdmin extends User{
    constructor(userId, email){
        super(userId, email, "admin");
    }
}
module.exports = UserAdmin;