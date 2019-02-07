const User = require('./User');


class UserAdmin extends User{
    constructor(){
        super("admin");
    }
}
module.exports = UserAdmin;