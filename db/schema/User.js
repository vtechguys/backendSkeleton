'use strict'
//my mongooose cooected to db
const mongooose = require('../connectDb');
//Schema class
const Schema = mongooose.Schema;
//App config
const config = require('../../config');


const UserSchema = new Schema({

    userId:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
    },
    emailVerified:{
        type: Boolean,
        
    },
    firstName: {
        type: String,
    },
    lastName:{
        type: String,
    },
    mobile:{
        type: String,
        unique: true,
    },
    temporaryMobile:{
        type: String,
        unique: true,

    },
    mobileVerified:{
        type: Boolean,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    },
    temporaryRole:{
        type: String,
        default: "user"
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }


    
});

const User = module.exports = mongooose.model(config.schemaNames.usersCollection, UserSchema);