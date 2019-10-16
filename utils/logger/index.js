'use strict'
/**
 * This is logging utils it logs to file
 * debug log is loging to detect flow of app
 * info is to log essential inforamtions
 * error wiil log any error in routes, function or otherwise
 * critical will log out very critical info like transactions use for audits for transactions purpose
 */
const { logger } = require('../../config');

log4js.configure({
    appenders: {
        debug: {
            type: 'file',
            filename: 'logs/debug.log',
            category: 'debug',
            maxLogSize: 20480 || logger.DEFAULT_MAX_FILE_SIZE,
            backups: 10 || logger.DEFAULT_BACKUPS
        },
        info: {
            type: "file",
            filename: "logs/info.log",
            category: 'info',
            maxLogSize: 20480 || logger.DEFAULT_MAX_FILE_SIZE,
            backups: 10 || logger.DEFAULT_BACKUPS

        },
        error: {
            type: 'file',
            filename: "logs/error.log",
            category: 'error',
            maxLogSize: 20480 || logger.DEFAULT_MAX_FILE_SIZE,
            backups: logger.DEFAULT_BACKUPS
        },
        critical:{
            type: "file",
            filename: "logs/critical.log",
            category: 'critical',
            maxLogSize:  20480 || logger.DEFAULT_MAX_FILE_SIZE,
            backups: 10 ||  logger.DEFAULT_BACKUPS

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

