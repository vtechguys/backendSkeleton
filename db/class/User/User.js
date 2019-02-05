class User{
    constructor(userId, email, phoneNo, role="user"){
        this.userId = userId;
        this.email = email;
        this.phoneNo = phoneNo;
        this.role = role;
        
    }
    $setFirstName(firstName){
        this.firstName = firstName;
    }
    $setLastName(lastName){
        this.lastName = lastName;
    }
    $setRole(role){
        this.role = role;
    }
    $setEmail(email){
        this.email = email;
    }
    $setPhoneNo(phoneNo){
        this.phoneNo = phoneNo;
    }

}
module.exports = User; 