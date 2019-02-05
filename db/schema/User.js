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

    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
   
    role: {
        type: String,
        required: true,
        default: 'user',
    }


    
});

const User = module.exports = mongooose.model(config.schemaNames.usersCollection, UserSchema);