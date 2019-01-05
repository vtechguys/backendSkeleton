'use strict';

//mongoose 
const mongoose = require("mongoose");
//App Configurations
const config = require("../config");
//Connect mongoose
mongoose.connect(config.DB_URL, function (err) {
    //Logs error and exit process
    if(err){
        console.error('Could not connect to MongoDB!');
        //exit process
        process.exit();
    } 
    else{
        console.error('Connected to MongoDB!');
    }
});
//Using gloabal promise
mongoose.Promise = global.Promise;
//To use this mongoose in schema(#/db/models)
module.exports = mongoose;
