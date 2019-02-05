'use strict'
/////////////////ConfigurationsApp Url EXPLICITLY FOR SUPER ADMIN///////////////////
/**
 * Super Admin specific routes 
 * Super Admin level --- Carefully manage
 * Will configure complete App all at once
 */
const configUrls = {
    '/roles/': ['get-rights', 'create', 'update-rights', 'load', 'delete', 'assign']
};
module.exports = configUrls;
// Dont include in index.js(config)