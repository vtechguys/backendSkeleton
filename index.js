'use strict'

//Express node http framework
const express = require('express');
const path = require('path');
//Logs HTTP request urls to console with time and reply
const loggerHttp = require('morgan');

const bodyParser = require('body-parser');
const mfavicon = require("express-favicon");

//authenticator RBAC middleware used for RBAC implementattion
const authenticate = require('./middleware/authenticate');

// crashReporter is reporting the crash of system and sends mail
const { crashReporter } = require("./utils");

// constants are all those values that are process var and dont change in app.
// paths to all resorces 
const { constants, paths } = require('./config');


/*

    App instance and CORS

*/
const app = express();

//CORS Middleware
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Https logger middleware, bodyparsing http request request.body, static file serving, browser favicon  
app.use(loggerHttp( constants.HTTP_LOGGER_TYPE ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use( express.static( path.join(__dirname, paths.STATIC_FILES ) ) );
app.use(mfavicon(__dirname + paths.FAVICON ));

// crash reporter initialised
crashReporter();

/*
    RBAC Middleware dependeing on config decides which strategy to follow expression session or jwt
*/
if(constants.SESSION_MODE === "jwt"){
    app.use( authenticate.jwtSession );
}
else{
    // app.use( authenticate.webSession ); no more using dont switch to this deleted many functionalities may break the app.
}







// Routes importing
// index serves / webpage and /webindex
const index = require('./routes/api/index');
// auth serves /auth login, register etc.
const auth = require('./routes/api/auth');

// Routes Mapper Middleware
app.use('/',index);
app.use('/auth', auth);
app.use('*', index);

// Error Handling
//catch 404 routes
app.use(function errorHandler(req, res, next) {
    var err = new Error('URL NOT SUPPORTED');
    err.code = 404;
    next(err);
});



const init = require('./config/init');
init.superAdmin();






const PORT = process.env.PORT || 1234;

// Server stats listening
app.listen( PORT , function appListener() {
    console.log(`Server stated at port ${PORT}`);
});

///Will need to export app instance later....
// module.exports = app;
