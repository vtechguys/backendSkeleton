'use strict'
/////////////////ConfigurationsApp Url EXPLICITLY FOR SUPER ADMIN///////////////////
/**
 * Super Admin specific routes 
 * Super Admin level --- Carefully manage
 * Will configure complete App all at once
 */
const configUrls = {
    '/roles/': ['get-rights', 'create-role', 'update-rights', 'load-role', 'delete-role', 'assign-role']
};
module.exports = configUrls;
// Dont include in index.js(config)