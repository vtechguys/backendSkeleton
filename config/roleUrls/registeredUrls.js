'use strict'

const registerUrls = {
    simple: {
        '/': [''],
        '/auth/': ['login', 'register', 'attempt-forgot-password', 'reset-forgot-password']
    },
    auth: {
        '/': ['web-index'],
        '/profile/': ['get-profile', 'update-profile',],
    },
    ALL_ROLES: ['superadmin', 'admin', 'moderator', 'seller', 'user', 'guest']

};

module.exports = registerUrls;
// Dont include in index.js config