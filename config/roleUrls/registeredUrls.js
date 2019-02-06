'use strict'

const registerUrls = {
    simple:{
        '/': ['login','register']
    },
    auth:{
        '/': ['login','register','webindex'],
        '/profile/':['get-profile'],
    }
};

module.exports = registerUrls;
// Dont include in index.js(config)