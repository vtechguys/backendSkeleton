'use strict'
/**
 * This is logging utils it logs to file
 * debug log is loging to detect flow of app
 * info is to log essential inforamtions
 * error wiil log any error in routes, function or otherwise
 * critical will log out very critical info like transactions use for audits for transactions purpose
 */
const log4js = require('log4js');


log4js.configure({
    appenders: {
        debug: {
            type: 'file',
            filename: 'logs/debug.log',
            category: 'debug',
            maxLogSize: 20480,
            backups: 10
        },
        info: {
            type: 'file',
            filename: 'logs/info.log',
            category: 'info',
            maxLogSize: 20480,
            backups: 10

        },
        error: {
            type: 'file',
            filename: 'logs/error.log',
            category: 'error',
            maxLogSize: 20480,
            backups: 10
        },
        critical: {
            type: 'file',
            filename: 'logs/critical.log',
            category: 'critical',
            maxLogSize: 20480,
            backups: 10

        }

    },
    categories: {
        default: {
            appenders: ['debug'],
            level: 'debug'
        }
    }
});

const loggers = log4js.getLogger('debug');

module.exports = loggers;

