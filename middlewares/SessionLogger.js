module.exports =  function sessionLogger(req, res, next) {
    console.log("Session:")
    console.log(req.session)
    next()
}