/**
 * Routing procedure, put all routes here with verison here.
 */



// index serves / webpage and /webindex
const index = require("./api/index");
// auth serves /auth login, register etc.
const auth = require("./api/auth");
// role serves /role get-roles, get-role, create-role, assign-role, delete-role, fill-rights
const role = require("./api/role");
  
function routesForApplicationVersion_V1(app) {
  app.use("/v1/", index);
  app.use("/v1/auth", auth);
  app.use("/v1/roles", role);
  app.use("/v1/*", index);
}


const  routesForApplicationVersion = {
    v1: routesForApplicationVersion_V1
};
module.exports = routesForApplicationVersion;