const User = require('./User');


class UserRider extends User{
    constructor(userId, email, phoneNo){
        super(userId, email, phoneNo, "user");
    }
}
module.exports = UserRider;