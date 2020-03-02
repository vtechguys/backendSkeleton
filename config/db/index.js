"use strict";

if (process.env.NODE_ENV == "production") {
  module.exports = require("./dbConfig_prod");
} else {
  module.exports = require("./dbConfig_dev");
}
