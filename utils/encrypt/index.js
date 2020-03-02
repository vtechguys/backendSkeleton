"use strict";
const crypto = require("crypto");
const logger = require("../logger");
const encrypt = {
  /*
   * generates random string of characters i.e salt
   * @function
   * @param {number} length - Length of the random string.
   */
  genRandomString(length) {
    logger.debug("utils encrypt genRandomString");
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex") /** convert to hexadecimal format */
      .slice(0, length); /** return required number of characters */
  },

  /*
   * hash password with sha512.
   * @function
   * @param {string} password - List of required fields.
   * @param {string} salt - Data to be validated.
   */
  sha512(string, salt) {
    logger.debug("utils encrypt sha512");
    try {
      var hash = crypto.createHmac("sha512", salt);
      hash.update(string);
      var value = hash.digest("hex"); /** Hashing algorithm sha512 */
    } catch (error) {
      logger.error(error);
    }
    return {
      salt: salt,
      hash: value
    };
  }
};

module.exports = encrypt;
