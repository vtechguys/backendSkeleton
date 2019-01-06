'use strict'
//my mongooose cooected to db
const mongooose = require('../connectDb');
//Schema class
const Schema = mongooose.Schema;
//App config
const config = require('../../config');


const UserSchema = new Schema({

});

const User = module.exports = mongooose.model(config.schemaNames.usersCollection, UserSchema);