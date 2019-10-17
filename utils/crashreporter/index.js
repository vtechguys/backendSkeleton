'use strict'
const { paths, constants } = require("../../config");
const logger = require('../logger');
function crashReporter() {
    //crash repoter
    logger.debug('utils crash reporter init');

    const CONFIG = {
        outDir: paths.CRASH_REPORTER_FILE_PATH, // default to cwd
        exitOnCrash: true, // if you want that crash reporter exit(1) for you, default to true,
        maxCrashFile: 100, // older files will be removed up, default 5 files are kept
    };

    if (process.env.NODE_ENV == 'production') {
        CONFIG.mailEnabled = true;
        CONFIG.mailTransportName = constants.MAIL_TRANSPORT_NAME;
        CONFIG.mailTransportConfig = {
            service: constants.MAIL_TRANSPORT_SERVICE,
            auth: {
                user: constants.MAIL_TRANSPORT_AUTH_EMAIL,
                pass: constants.MAIL_TRANSPORT_AUTH_PASSWORD
            }
        };
        CONFIG.mailSubject = `CrashReport for  ${constants.COMPANY_NAME}`;
        CONFIG.mailFrom = `crashreport ${constants.MAIL_TRANSPORT_AUTH_EMAIL}`;
        CONFIG.mailTo = constants.DEV_EMAIL_CRASH_REPORT;
    }
    require('crashreporter').configure(CONFIG);
}

module.exports = crashReporter;