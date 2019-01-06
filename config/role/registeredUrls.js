'use strict'

const registerUrls = {
    simple:{
        '/': ['/login','/register']
    },
    auth:{
        '/': ['/login','/register','/webindex']
    }
};

module.exports = registerUrls;
// Dont include in index.js(config)