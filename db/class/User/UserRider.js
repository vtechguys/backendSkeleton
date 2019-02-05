const User = require('./User');


class UserRider extends User{
    constructor(userId, email){
        super(userId, email, "user");
    }
}
module.exports = UserRider;