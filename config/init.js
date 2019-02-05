const logger = require('./logger');

//superadmin exclusive rights
const configUrl = require('./roleUrls/configUrls');
//all rights/url supported by application;
const allUrls = require('./roleUrls/registeredUrls');
//auth
const authUrls = allUrls.auth;

const init = {
    superAdmin(){
        logger.debug('init > superAdmin');
        //array of superadmin rights willbe filled
        const superAdminRights = [];
        //fills superadmin specific urls as its rights

        Object.keys(configUrl).forEach(function(keyBaseUrl){
            for(let i = 0; i< keyBaseUrl.length; i++){
                let right = {
                    name: configUrl[keyBaseUrl][i], // resourece name
                    path: keyBaseUrl, //base path name
                    url: keyBaseUrl + configUrl[keyBaseUrl][i]// complete url = path(base)/name(resource) 
                };
                superAdminRights.push(right);
            }
        });

        //fill now all suppoterd urls as superadmin right...
        Object.keys(authUrls).forEach(function(keyBaseUrl){
            for(let i=0; i< authUrls.length; i++){
                let right = {
                    name: authUrls[keyBaseUrl][i],
                    path: keyBaseUrl,
                    url:  authUrls[keyBaseUrl] + authUrls[keyBaseUrl][i] 
                };
                superAdminRights.push(right);
            }
            
        });
        //Now superAdminRights[] consists of all rights that will be accessed thorighout applications

        const dbOperations = require('../db/crudOperation/role');

        dbOperations.createSuperAdmin((error, result)=>{
            if(error){
                logger.error('error creating superadmin');
                process.exit();
            }
        });



    }
};
module.exports = init;