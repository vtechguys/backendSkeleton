'use strict'

//Express node http framework
const express = require('express');

//Logs HTTP request urls to console with time and reply
const loggerHttp = require('morgan');

const bodyParser = require('body-parser');
const mfavicon = require("express-favicon");
const path = require('path');

//authenticator RBAC middleware used for RBAC implementattion
const authenticate = require('./middleware/authenticate');

// Utils all required
// logger is logging utils logs in file all events and error
// crashReporter is reporting the crash of sytem and sends mail
const { crashReporter } = require("./utils");

// Configs requried in app
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
app.use(loggerHttp( constants.LOGGER_TYPE ));
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
    app.use( authenticate.webSession );
}







// Routes importing
// index serves / webpage and /webindex
const index = require('./routes/api/index');
// auth serves /auth login, register etc.
const auth = require('./routes/api/auth');

// Routes Mapper Middleware
app.use('/',index);
app.use('/auth', auth);


// Error Handling
//catch 404 routes
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.code = 404;
    next(err);
});



///Will need to export app instance later....
// module.exports = app;



const PORT = process.env.PORT || 5500;



const init = require('./config/init');
init.superAdmin();


// Server stats listening
app.listen( PORT , function () {
    console.log(`Server stated at port ${PORT}`);
});