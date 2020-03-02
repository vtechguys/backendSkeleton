"use strict";
///////////////////////////Path configurations/////////////////////////////
/**
 *
 * Config to all path used in project.
 * All project path are refrenced from root level.
 * ~/backend = rootLevel = #/
 *
 */
const path = require("path");
function completePath(pathFile) {
  return path.join(__dirname, "../", pathFile);
}
const pathsConfig = {
  FAVICON: completePath("public/build/favicon.png"),
  HOME_PAGE: completePath("public/build/index.html"),
  STATIC_FILES: completePath("public/build/"),
  CRASH_REPORTER_FILE_PATH: completePath("logs")
};
module.exports = pathsConfig;
