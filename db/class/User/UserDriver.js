const User = require('./User');


class UserDriver extends User{
    constructor(){
        super("driver");
}
}
module.exports = UserDriver;