const User = require('./User');


class UserVendor extends User{
    constructor(userId, email){
        super(userId, email, "vendor");
    }
}
module.exports = UserVendor;