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
        var l = Object.keys(configUrl);
        Object.keys(configUrl).forEach(function(keyBaseUrl){
            console.log(keyBaseUrl.length);
            for(let i = 0; i < configUrl[keyBaseUrl].length; i++){
                console.log(configUrl[keyBaseUrl][i],keyBaseUrl);

                let right = {
                    name: configUrl[keyBaseUrl][i], // resourece name
                    path: keyBaseUrl, //base path name
                    url: keyBaseUrl + configUrl[keyBaseUrl][i]// complete url = path(base)/name(resource) 
                };
                superAdminRights.push(right);
            }
        });
        // console.log(superAdminRights,"\n\n_________________",authUrls,"_________________")
        //fill now all suppoterd urls as superadmin right...
        Object.keys(authUrls).forEach(function(keyBaseUrl){
            for(let i=0; i< authUrls[keyBaseUrl].length; i++){
                let right = {
                    name: authUrls[keyBaseUrl][i],
                    path: keyBaseUrl,
                    url:  keyBaseUrl + authUrls[keyBaseUrl][i] 
                };
                superAdminRights.push(right);
            }
            
        });
        //Now superAdminRights[] consists of all rights that will be accessed thorighout applications
        //it holds updated rights...
        console.log(superAdminRights);
        const dbOperations = require('../db/crudOperation/role');

        dbOperations.createSuperAdmin((error, result)=>{
            if(error){
                logger.error('error creating superadmin');
                process.exit();
            }
        });

        //give superAdmin Role any updated rights as in superAdminRights[]
        dbOperations.getRole('superadmin', (error, result)=>{
            if(error){
                process.exit();
            }
            else{
                if(!result){
                    //create and then fill
                    dbOperations.createRole('superadmin',(error1, result1)=>{
                        if(error1){
                            process.exit();
                        }
                        else{
                            dbOperations.fillRights(result1.roleId, superAdminRights, (error3, results)=>{
                                if(error3){
                                    process.exit();
                                }
                            });
                        }
                    });
                }
                else{
                    //fill any updated rights
                    dbOperations.fillRights(result.roleId, superAdminRights, (error2, result2)=>{
                        if(error2){
                            process.exit();
                        }

                    });
                }
            }
        });


    }
};
module.exports = init;