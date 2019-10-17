'use strict'

const { logger } = require('../utils');

const CONFIG_URLS = require('./roleUrls/configUrls');
const ALL_URLS = require('./roleUrls/registeredUrls');
const AUTH_URLS = ALL_URLS.auth;


const RoleCRUD = require('../db/crudOperation/role');


const init = {
    superAdmin() {
        logger.debug('init > superAdmin');
        const superAdminRights = [];
        console.log("INIT_SUPERAMDIN_ROLE_RIGHTS");
        //fills superadmin specific urls as its rights
        Object.keys(CONFIG_URLS).forEach(function (keyBaseUrl) {
            for (let i = 0; i < CONFIG_URLS[keyBaseUrl].length; i++) {

                const right = {
                    name: CONFIG_URLS[keyBaseUrl][i], // resourece name
                    path: keyBaseUrl, //base path name
                    url: keyBaseUrl + CONFIG_URLS[keyBaseUrl][i]// complete url = path(base)/name(resource) 
                };
                superAdminRights.push(right);
            }
        });
        //fill now all suppoterd urls as superadmin right...
        Object.keys(AUTH_URLS).forEach(function (keyBaseUrl) {
            for (let i = 0; i < AUTH_URLS[keyBaseUrl].length; i++) {
                const right = {
                    name: AUTH_URLS[keyBaseUrl][i],
                    path: keyBaseUrl,
                    url: keyBaseUrl + AUTH_URLS[keyBaseUrl][i]
                };
                superAdminRights.push(right);
            }

        });
        //Now superAdminRights[] consists of all rights that will be accessed thorghout applications

        //it holds updated rights...

        RoleCRUD
            .createSuperAdmin(function initCreateSuperAdmin(error, result) {
                if (error) {
                    logger.error(error);
                    process.exit();
                }
            });

        //give superAdmin Role any updated rights as in superAdminRights[]
        RoleCRUD
            .getRole('superadmin', function initGetRole(error, result) {
                if (error) {
                    logger.error(error);
                    process.exit();
                }
                else {
                    if (!result) {
                        //create and then fill

                        RoleCRUD.createRole('superadmin', (error1, result1) => {
                            if (error1) {
                                process.exit();
                            }
                            else {
                                RoleCRUD.fillRights(result1.roleId, superAdminRights, (error3, results) => {
                                    if (error3) {
                                        process.exit();
                                    }
                                });
                            }
                        });
                    }
                    else {
                        //fill any updated rights
                        RoleCRUD.fillRights(result.roleId, superAdminRights, (error2, result2) => {
                            if (error2) {
                                process.exit();
                            }

                        });
                    }
                }
            });


    }
};
module.exports = init;