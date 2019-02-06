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
        required: true
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
        type: String
    },
    temporaryMobile:{
        type: String
    },
    mobileVerified:{
        type:Boolean,
    },
    role: {
        type: String,
        required: true,
        default: 'user',
    }


    
});

const User = module.exports = mongooose.model(config.schemaNames.usersCollection, UserSchema);