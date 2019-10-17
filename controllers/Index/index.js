'use strict'

const dbOperations = require('../../db/crudOperation/index');

function indexRouteHandler(request, response){
    response.send('😃🔗👽');
}
function indexWebIndexRouteHandler(request, response){
    const userData = request.userData;
    dbOperations.checkUserAndThenCreateSession(userData, response);
}

module.exports = {
    indexRouteHandler,
    indexWebIndexRouteHandler
};