'use strict'

const DEFAULT_FILE_SIZE = 20480;
const DEFAULT_BACKUPS = 10;

const loggerConfig = {
    DEFAULT_FILE_SIZE,
    DEFAULT_BACKUPS,

    DEBUG_MAX_FILE_SIZE: DEFAULT_FILE_SIZE,
    INFO_MAX_FILE_SIZE: DEFAULT_FILE_SIZE,
    ERROR_MAX_FILE_SIZE: DEFAULT_FILE_SIZE,
    CRITICAL_MAX_FILE_SIZE: DEFAULT_FILE_SIZE,

    
}; 

module.exports = loggerConfig;