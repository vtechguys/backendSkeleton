'use strict'

const registerUrls = {
    simple:{
        '/':[''],
        '/auth/': ['login','register']
    },
    auth:{
        '/': ['web-index'],
        // '/auth/': [],
        '/profile/':['get-profile'],
    }
};

module.exports = registerUrls;
