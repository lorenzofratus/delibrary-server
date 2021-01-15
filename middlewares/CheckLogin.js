var utils = require('../utils/writer.js');

module.exports =  function checkLogin(req, res, next) {
    if(req.session.user)
        next()
    else
        utils.writeJson(res, utils.respondWithCode(401));
}