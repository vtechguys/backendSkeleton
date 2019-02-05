const config = require('../config');
const logger = config.logger;

const generator = {
    randomString(length=8){
        logger.debug('generate random string of length = ',length);
        const randomString = require('randomstring');
        return randomString.generate(length);
    },
    randomNumber(min=1000, max=9999){
        logger.debug('generate random number b/w ',min,' & ',max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};
module.exports = generator;