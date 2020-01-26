'use strict';

/////////////////////////////Schema for session//////////////////
const mongoose = require('../connectDb');
const config = require('../../config');
const Schema = mongoose.Schema;


///auto document expire time
const EXPIRE_DOC_TIME = 2592000;//30Days

const sessionSchema = new Schema({
    sessionId: { 
        type : String,
        unique : true,
        required : true
    },
    uuid: { 
        type : String,
        required : true
    },
    objectId: String,
    firstName: String,
    lastName: String,
    userId: String,
    email: String,
    username: String,
    role: String,
    registrationDate: Date,
    emailVerified: Boolean,
    temporaryMobile: String,
    mobile: String,
    countryCode: String,
    address:{ 
        a: String,
        area: String,
        city: String,
        state: String,
        pincode: String,
        country: String 
    },
    gender: String,
    geoLocation: {
        type: { type: String },
        coordinates: [Number]
    },
    paymentDetails: {
        paytm: String,
        bankDetails: {
            ifsc: String,
            bankName: String,
            accountNumber: String,
            accountHolderName:String,
            accountType:String
    
        }
      },
    createdAt:{
        type:Date,
        expires:'30d',
        default:Date.now
    },
    profilePic:String
});

sessionSchema.index({ userId: 1 });
sessionSchema.index({ sessionId: 1 });
const Session = mongoose.model(config.schemaNames.sessionsCollection, sessionSchema); 

module.exports = Session;