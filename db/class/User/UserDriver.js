const User = require('./User');


class UserDriver extends User{
    constructor(userId, email){
        super(userId, email, "driver");
    }
}
module.exports = UserDriver;