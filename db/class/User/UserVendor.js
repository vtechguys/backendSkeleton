const User = require('./User');


class UserVendor extends User{
    constructor(userId, email, phoneNo){
        super(userId, email, phoneNo, "vendor");
    }
}
module.exports = UserVendor;