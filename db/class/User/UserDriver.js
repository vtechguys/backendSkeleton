const User = require('./User');


class UserDriver extends User{
    constructor(userId, email, phoneNo){
        super(userId, email, phoneNo, "driver");
    }
}
module.exports = UserDriver;