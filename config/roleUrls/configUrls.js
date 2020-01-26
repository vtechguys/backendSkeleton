'use strict'
/**
 * Super Admin specific routes 
 * Super Admin level --- Carefully manage
 * Will configure complete App all at once
 */
const configUrls = {
    '/roles/': ['fetch-roles', 'fetch-all-rights', 'create-role', 'fill-rights', 'fetch-role', 'delete-role', 'assign-role']
};
module.exports = configUrls;
// Dont include in index.js(config)