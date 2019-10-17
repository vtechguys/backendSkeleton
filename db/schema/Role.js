'use strict'

const mongoose = require('../connectDb');
const Schema = mongoose.Schema;
const { schemaNames } = require('../../config');

const roleSchema = new Schema({
  roleId: { 
        type : String,
        unique : true,
        required : true
    },
  role: { 
      type : String,
      unique : true,required : true 
    },
  rights: [
    {
      name: String,
      path: String,
      url: String
    }
  ]
});

const Role = mongoose.model(schemaNames.rolesCollection, roleSchema);

module.exports = Role;