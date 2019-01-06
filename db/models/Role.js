'use strict'

//My mongooose connect
const mongoose = require('../connectDb');
//mongoose Schema Class
const Schema = mongoose.Schema;
//App config
const config = require('../../config');

//Role Schema
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

const Role = mongoose.model(config.schemaNames.rolesCollection, roleSchema);

module.exports = Role;