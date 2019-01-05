'use strict'

///////////////////////////Imports///////////////////////////////////


//Express node http framework
const express = require('express');
//Logs everthing to file
const logger = require('logger');
//parse html body
const bodyParser = require('body-parser');
//favicon page
const mfavicon = require("express-favicon");

//configApp
const config = require('./config');





////////////////////////////////App//////////////////////////////////


//App instance
const app = express();

//CORS Middleware
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Logger
app.use(logger('dev'));
//body pareser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//favicon
app.use(mfavicon(__dirname + config.paths.FAVICON ));
//crash repoter
require('crashreporter').configure({
    outDir: './logs', // default to cwd
    exitOnCrash: true, // if you want that crash reporter exit(1) for you, default to true,
    maxCrashFile: 100, // older files will be removed up, default 5 files are kept
    // mailEnabled: true,
    // mailTransportName: 'SMTP',
    // mailTransportConfig: {
    //     service: 'Gmail',
    //     auth: {
    //         user: "yourmail@gmail.com",
    //         pass: "yourpass"
    //     }
    // },
    // mailSubject: 'advanced.js crashreporter test',
    // mailFrom: 'crashreporter <yourmail@gmail.com>',
    // mailTo: 'yourmail@gmail.com'
});

//////////////////Use session technique you want/////////////////////
//authenticator middleware
if(config.SESSION_MODE === "jwt"){
    app.use();
}
else{
    //use express session
}


//////////////////////////////Error Handling//////////////////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler //--->comment in production
const vm = require('vm');
const logger2 = require('./config/logger');
const Debug = vm.runInDebugContext('Debug'); // Obtain Debug object

Debug.setListener((type, _, e) => { // listen for all debug events
  if (type == Debug.DebugEvent.Exception) {
    logger2.error(e.exception().stack) // e is an event object
  }
});

Debug.setBreakOnException(); // this is required for Exception event to fire



///Will need app instance later....
module.exports = app;




//PORT
const PORT = process.env.PORT || 5500;
///Server starting
app.listen( PORT , function () {
    console.log(`Server stater at port ${PORT}`);
})