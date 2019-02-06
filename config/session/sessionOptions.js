'use strict'
const appConstants = require('../appConstants');
const allUrls = require('../roleUrls/registeredUrls');
const configUrls = require('../roleUrls/configUrls');
const logger = require('../logger');

const simpleUrl = allUrls.simple;
const authUrl = allUrls.auth;

const URLS = [];
const SURLS = [];

const RoleCRUD = require('../../db/crudOperation/role');

Object.keys(simpleUrl).forEach(function(keyBaseUrl){
    for(let i=0; i< simpleUrl[keyBaseUrl].length; i++){
        let url = keyBaseUrl + simpleUrl[keyBaseUrl][i];
        SURLS.push(url);
    }
});

Object.keys(authUrl).forEach(function(keyBaseUrl){
    for(let i=0; i< authUrl[keyBaseUrl].length; i++){
        let url = keyBaseUrl + authUrl[keyBaseUrl][i];
        URLS.push(url);
    }
});

Object.keys(configUrls).forEach(function(keyBaseUrl){
    for(let i=0; i< configUrls[keyBaseUrl].length; i++){
        let url = keyBaseUrl + configUrls[keyBaseUrl][i];
        URLS.push(url);
    }
})
const checkRights = (request, response, next)=>{
    RoleCRUD.getRole(request.userData.role, (error, result)=>{
        if(error){
            logger.error(error);
            response.json({
                message: "Some Error Occured",
                success: false,
                code: 500
            });
        }
        else{
            if(!result){
                response.json({
                    message: "User unkown or role not found",
                    success: false,
                    code: 404
                });
            }
            else{
                const rights = [];
                for(let i =0; i< result.rights.length; i++){
                    rights.push(result.rights[i].url);
                }
                if( rights.indexOf(request.url) > -1){
                    next();
                }
                else{
                    response.json({
                        message: "Access denied.",
                        success: false,
                        code: 401
                    });
                }
            }
        }
    });
}

const authenticate = {
    webSession(){
        //express-sessions
    },
    jwtSession(request, response, next){
        //jwt-sessions
        logger.debug('jwtSession');
        const requestedUrl = request.url
        if( URLS.indexOf( requestedUrl ) > -1 ){
            logger.debug('sessionJwt urls');
            const jwt = require('jsonwebtoken');
            const jwtOperations = require('./jwtOptions');

            const tokenHeader = request.headers["authorization"];

            if(tokenHeader && (typeof(tokenHeader) !== "undefined" ) ){
                const tokenArray = tokenHeader.split(" ");
                const format = tokenArray[0];
                const token = tokenArray[1];
                let isValidTokenFormat = false;
                if(format && typeof(format) === "string" &&  format === "token"){
                    isValidTokenFormat = true;
                }
                if(isValidTokenFormat){
                    if(!token){
                        response.send("token missing.");
                    }
                    else{
                       request["token"] = token;
                       jwtOperations.getSessionByUserId(token, (error, result)=>{
                           if(error){
                               response.send(error);
                           }
                           else{
                               if(result && result.sessionId){
                                    request["userData"] = result.toObject();
                                    request["sessionMode"] = "jwt";
                                    jwt.verify(request.token, appConstants.jwtKey, function(error1, result1){
                                        if(error){
                                            logger.error(error);
                                            response.json({
                                                message: "Unknown user.",
                                                success: false,
                                                code: 401
                                            });
                                        }
                                        else{
                                            checkRights(request, response, next);
                                        }
                                    });
                               }
                               else{
                                    response.json({ 
                                        message: "User session not found.",
                                        success: false,
                                        code: 401 
                                    });
                                }
                           }
                       }); 
                    }
                }
                else{
                    response.send("Invalid token format.\ntoken<space>{userTokenHere}");
                }
            }
            else if( SURLS.indexOf(requestedUrl) > -1 ){
                next();
            }
            else {
              response.json({
                  message: "Unknown user",
                  success: false,
                  code: 401
              });  
            }

        }
        else{
            //simple url just
            next();
        }
    }
};
module.exports = authenticate;
