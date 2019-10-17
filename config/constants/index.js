'use strict'

if(process.env.NODE_ENV == "production"){
    module.exports = require('./constants_prod');
}
else{
    module.exports = require('./constants_dev');
}