'use strict'

const { constants, APP_VERSION } = require('../config');

const ALL_URLS = require('../config/roleUrls/registeredUrls');
const CONFIG_URLS = require('../config/roleUrls/configUrls');

const { logger, sendResponse } = require('../utils');

const { session } = require('../utils');
const jwtOperations = session.jwtOperations;

const jwt = require('jsonwebtoken');


const SIMPLE_URLS = ALL_URLS.simple;
const AUTH_URLS = ALL_URLS.auth;

const SIMPLE_URLS_ARRAY = [];
const AUTH_URLS_ARRAY = [];

const RoleCRUD = require('../db/crudOperation/role');





Object.keys(SIMPLE_URLS).forEach(function (keyBaseUrl) {
    for (let i = 0; i < SIMPLE_URLS[keyBaseUrl].length; i++) {
        let url = '/' + APP_VERSION + keyBaseUrl + SIMPLE_URLS[keyBaseUrl][i];
        SIMPLE_URLS_ARRAY.push(url);
    }
});

Object.keys(AUTH_URLS).forEach(function (keyBaseUrl) {
    for (let i = 0; i < AUTH_URLS[keyBaseUrl].length; i++) {
        let url = '/' + APP_VERSION +  keyBaseUrl + AUTH_URLS[keyBaseUrl][i];
        AUTH_URLS_ARRAY.push(url);
    }
});

Object.keys(CONFIG_URLS).forEach(function (keyBaseUrl) {
    for (let i = 0; i < CONFIG_URLS[keyBaseUrl].length; i++) {
        let url = '/' + APP_VERSION +  keyBaseUrl + CONFIG_URLS[keyBaseUrl][i];
        AUTH_URLS_ARRAY.push(url);
    }
});
function checkRights(request, response, next) {
    RoleCRUD.getRole(request.userData.role, (error, result) => {
        if (error) {
            logger.error(error);
            sendResponse.serverError(response);
        }
        else {
            if (!result) {
                sendResponse.notFound(response, "User unknown or role not found.");
            }
            else {
                const rights = [];

                for (let i = 0; i < result.rights.length; i++) {
                    rights.push(result.rights[i].url);
                }
                if (rights.indexOf(request.url) > -1) {
                    next();
                }
                else {
                    sendResponse.unauthorized(response, "Access denied.");
                }
            }
        }
    });
}

const authenticate = {
    jwtSession(request, response, next) {
        logger.debug('jwtSession');

        const requestedUrl = request.url

        const isRequestedUrlAuthUrl = AUTH_URLS_ARRAY.indexOf(requestedUrl) > -1;
        const isRequestedUrlSimpleUrl = SIMPLE_URLS_ARRAY.indexOf(requestedUrl) > -1;
       
        if (isRequestedUrlAuthUrl || isRequestedUrlSimpleUrl) {
            logger.debug('sessionJwt urls');

            const tokenHeader = request.headers["authorization"];
            if (tokenHeader) {

                const tokenArray = tokenHeader.split(" ");
                const format = tokenArray[0];
                const token = tokenArray[1];

                let isValidTokenFormat = false;

                if (format && typeof (format) == "string" && format == "token") {
                    isValidTokenFormat = true;
                }

                if (isValidTokenFormat && token) {

                    request["token"] = token;

                    jwtOperations.getSessionBySessionId(token, (error, sessionResult) => {
                        if (error) {
                            logger.error(error);
                            sendResponse.serverError(response);
                        }
                        else {
                            if (sessionResult && sessionResult.sessionId) {

                                request["userData"] = sessionResult.toObject();
                                request["sessionMode"] = "jwt";

                                jwt.verify(request.token, constants.JWT_KEY, function (error1, result1) {
                                    if (error1) {
                                        logger.error(error1);
                                        // error occurrs this token is invalid jwt token
                                        sendResponse.serverError(response, "Unknown user.");
                                    }
                                    else {
                                        checkRights(request, response, next);
                                    }
                                });
                            }
                            else {
                                sendResponse.notFound(response, "Session not found.");
                            }
                        }
                    });

                }
                else {
                    sendResponse.badRequest(response, "Invalid token format or missing token.");
                }
            }
            else {
                if(isRequestedUrlAuthUrl){
                    sendResponse.unauthorized(response, "Unknown user.");
                }
                else{
                    next();
                }
            }


        }
        else {
            // sendResponse.badRequest(response, "URL not supported.");
            next();
        }
    }
};

module.exports = authenticate;