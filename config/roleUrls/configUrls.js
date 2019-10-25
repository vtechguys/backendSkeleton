'use strict'
/////////////////ConfigurationsApp Url EXPLICITLY FOR SUPER ADMIN///////////////////
/**
 * Super Admin specific routes 
 * Super Admin level --- Carefully manage
 * Will configure complete App all at once
 */
const configUrls = {
    '/roles/': ['get-roles', 'get-rights', 'create-role', 'fill-rights', 'get-role', 'delete-role', 'assign-role']
};
module.exports = configUrls;
// Dont include in index.js(config)