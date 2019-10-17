'use strict'

const registerUrls = {
    simple:{
        '/auth/': ['login','register']
    },
    auth:{
        '/': ['web-index'],
        '/auth/': ['login','register'],
        '/profile/':['get-profile'],
    }
};

module.exports = registerUrls;
