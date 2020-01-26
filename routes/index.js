/**
 * Routing procedure, put all routes here with verison here.
 */



// index serves / webpage and /webindex
const index = require('./api/index');
// auth serves /auth login, register etc.
const auth = require('./api/auth');
// role serves /role fetch-roles, fetch-role, create-role, assign-role, delete-role, fill-rights
const role = require('./api/role');
  
function routesForApplicationVersion(app) {
  app.use('/v1/', index);
  app.use('/v1/auth', auth);
  app.use('/v1/roles', role);
  app.use('/v1/*', index);
}



module.exports = routesForApplicationVersion;