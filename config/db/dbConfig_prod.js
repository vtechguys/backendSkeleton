
'use strict'
////////////////////Db configurations//////////////////////
/**
 * Have all db realted configurations...
 * DB_TYPE: type of db service mongodb
 * DB_USERNAME: Username of Db
 * DB_PASSWORD: Password of Db
 * DB_BASE_URL: URL of Db service provide company for our Db hosting
 * DB_PORT: provided db port in db space
 * DB_NAME: Name chosen by us in Db space
 */
const dbConfig = {
    DB_TYPE:'mongodb',
    DB_USERNAME:'username',
    DB_PASSWORD:'password',
    DB_BASE_URL:'url',
    DB_PORT:'port',
    DB_NAME:'dbname'
};
module.exports = dbConfig;