'use strict'

const registerUrls = {
    simple:{
        '/':[''],
        '/auth/': ['login','register']
    },
    auth:{
        '/': ['web-index'],
        '/profile/':['get-profile', 'update-profile', ],
    },
    ALL_ROLES: ['superadmin','admin', 'moderator', 'seller', 'user', 'guest']

};

module.exports = registerUrls;
