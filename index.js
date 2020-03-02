"use strict";

const express = require("express");
//Logs HTTP request urls to console with time and reply
const loggerHttp = require("morgan");

const bodyParser = require("body-parser");
// const mfavicon = require('express-favicon');

//authenticator RBAC middleware used for RBAC implementattion
const authenticate = require("./middleware/authenticate");

// crashReporter is reporting the crash of system and sends mail
const { crashReporter } = require("./utils");

const { constants, paths } = require("./config");

const app = express();

//CORS Middleware
app.use(function setCorsHeaders(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Https logger middleware, bodyparsing http request request.body, static file serving, browser favicon
app.use(loggerHttp(constants.HTTP_LOGGER_TYPE));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// if we are holding the static content on the very same server then this is requied esle I dont use it.
// app.use( express.static( paths.STATIC_FILES  ) );
// app.use(mfavicon(paths.FAVICON ));

// crash reporter initialised
crashReporter();

/*
    RBAC Middleware dependeing on config decides which strategy to follow expression session or jwt
*/
if (constants.SESSION_MODE === "jwt") {
  app.use(authenticate.jwtSession);
} else {
  // app.use( authenticate.webSession ); no more using dont switch to this deleted many functionalities may break the app.
}

// Routes importing
require("./routes")(app);

// Error Handling
//catch 404 routes
app.use(function errorHandler(req, res, next) {
  var err = new Error("URL NOT SUPPORTED");
  err.code = 404;
  next(err);
});

const init = require("./config/init");
init.superAdmin();

const PORT = process.env.PORT || 1234;

// Server stats listening
app.listen(PORT, function appListener() {
  console.log(`Server stated at port ${PORT}`);
});

///Will need to export app later....
// module.exports = app;
