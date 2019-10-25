'use strict'

const registerUrls = {
    simple:{
        '/':[''],
        '/auth/': ['login','register']
    },
    auth:{
        '/': ['web-index'],
        '/profile/':['get-profile', 'update-profile', ],
    }
};

module.exports = registerUrls;
