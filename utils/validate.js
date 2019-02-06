'use strict';
const config = require('../config');
const logger = config.logger;

const validate = {

    username: function (string) {
        logger.debug('validate username');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9._@]+$/;
        if (string.length < 5 || string.length > 50 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    password: function (string) {
        logger.debug('validate password');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[a-z0-9]+$/;
        if (string.length != 32 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    email: function (string) {
        logger.debug('validate email');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var comValid=true;
        var atpos = string.indexOf("@");
        var dotpos = string.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= string.length) {
            comValid=false;
        }
        var letters = /^[A-Z0-9a-z!@#$%&*+-/=?^_`'{|}~]+$/;
        if (string.length < 5 || string.length > 50 || string.match(letters) === null || string.match("@") === null || comValid===false) {
            return false;
        }
        else {
            return true;
        }
    },
    mobile: function (string) {
        logger.debug('validate mobile');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[0-9]+$/;
        if (string.length != 10 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    number: function (string) {
        logger.debug('validate number');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[0-9]+$/;
        if (string.length < 3 || string.length > 15 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    string: function (string) {
        logger.debug('validate string');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.:@| ]+$/;
        if (string.length < 2 || string.length > 5000 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    name: function (string) {
        logger.debug('validate name');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z ]+$/;
        if (string.length < 1 || string.length > 50 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    code: function (string) {
        logger.debug('validate code');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9+]+$/;
        if (string.length < 2 || string.length > 16 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    id: function (string) {
        logger.debug('validate id');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9]+$/;
        if (string.length < 8 || string.length > 32 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    gender: function (string) {
        logger.debug('validate gender');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        var string = string.trim();
        if (string !== 'male' && string !== 'female' && string !== 'other') {
            return false;
        }
        else {
            return true;
        }
    },
    longString: function (string) {
        logger.debug('validate longstring');
        if (string === undefined || typeof(string)!="string") {
            return false;
        }
        
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.:+#&=%()^*!@$[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D] ]+$/;
        if (string.length < 2 || string.length > 5000 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    stringArray: function (array) {
        logger.debug('validate stringArray');
        var that = this;
        if (!array || array.length < 1 || array.length > 50) {
            return false;
        }
        var valid = true;
        for (var i = 0; i < array.length; i++) {
            valid = that.string(array[i]);
            if (valid != true) {
                break;
            }
        }
        return valid;
    },
    tagArray: function (array) {
        logger.debug('validate stringArray');
        var that = this;
        if (!array || array.length < 0 || array.length > 100) {
            return false;
        }
        var valid = true;
        for (var i = 0; i < array.length; i++) {
            valid = that.string(array[i]);
            if (valid != true) {
                break;
            }
        }
        return valid;
    },
    stringObjectArray: function (array) {
        logger.debug('validate stringObjectArray');
        var that = this;
        if (!array || array.length < 1 || array.length > 1000 || array.length == undefined) {
            return false;
        }
        var allProperty = {
            valid:true
        };
        for (var i = 0; i < array.length; i++) {
            Object.keys(array[i]).forEach(function (key) {
                var valid = that.string(array[i][key]);
                if (valid != true) {
                    allProperty.valid = false;
                }
            });
            if(allProperty.valid === false){
                break;
            }
        }
        return allProperty.valid;
    },

    objectArray: function (array) {
        logger.debug('validate stringObjectArray');
        var that = this;
        if (!array || array.length < 1 || array.length > 1000 || array.length == undefined) {
            return false;
        }
        var allProperty = {
            valid:true
        };
        for (var i = 0; i < array.length; i++) {
            Object.keys(array[i]).forEach(function (key) {
                var valid = (typeof(array[i][key]) === "string" || (array[i][key] instanceof Array=== true))
                
                if (valid != true) {
                    allProperty.valid = false;
                }
            });
            if(allProperty.valid === false){
                break;
            }
        }
        return allProperty.valid;
    },



    stringObject:function (obj){
        logger.debug('validate stringObject');
        var that = this;
        if(obj){
            var allProperty = {
                valid:true
            };
            Object.keys(obj).forEach(function (key) {
                var valid = that.string(obj[key]);
                if (valid != true) {
                    allProperty.valid = false;
                }
            });
            return allProperty.valid;
        }
        else{
            return false;
        }
    },
    complexString: function (string) {
        logger.debug('validate string');
        if (string === undefined) {
            return false;
        }
        var string = string.trim();
        var letters = /^[A-Za-z0-9-/_',.!@#$%&?:*()+=|\x22 ]+$/;
        if (string.length < 2 || string.length > 5000 || string.match(letters) === null) {
            return false;
        }
        else {
            return true;
        }
    },
    idArray: function (array) {
        logger.debug('validate idArray');
        var that = this;
        if (!array || array.length < 1 || array.length > 30) {
            return false;
        }
        var valid = true;
        for (var i = 0; i < array.length; i++) {
            valid = that.id(array[i]);
            if (valid != true) {
                break;
            }
        }
        return valid;
    },
};

module.exports = validate;
