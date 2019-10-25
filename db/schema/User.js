'use strict'
//my mongooose cooected to db
const mongooose = require('../connectDb');
//Schema class
const Schema = mongooose.Schema;
//App config
const config = require('../../config');


const UserSchema = new Schema({
    // userId
    userId: {
        type: String,
        unique: true,
        required: true
    },
    // Email
    email: {
        type: String,
        unique: true,
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailToken: {
        type: String,
    },
    emailTokenTimeStamp: {
        type: Date,
    },
    // Name
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    // Mobile
    countryCode: {
        type: String
    },
    mobile: {
        type: String,
        unique: true,
        sparse: true
    },
    temporaryMobile: {
        type: String,
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    mobileTokenTimeStamp: {
        type: Date
    },
    mobileToken: {
        type: String
    },
    // password
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    passwordToken: {
        type: String,
    },
    passwordTimeStamp: {
        type: Date
    },
    // username
    username: {
        type: String,
        unique: true,
        requried: true
    },
    //gender
    gender: {
        type: String
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    // Social
    social: [
        {
            sId: String,
            accessToken: String,
            name: String
        }
    ],
    socialLink: [
        {
            name: String,
            link: String

        }
    ],
    // profile pic
    profileImage: String,
    role: {
        type: String,
        default: "guest"
    },
    // bio
});
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });
UserSchema.index({ username: 1 });

const User = module.exports = mongooose.model(config.schemaNames.usersCollection, UserSchema);