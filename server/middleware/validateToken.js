// This is the middleware to validating and authenticating the JWT token

const jwt = require("jsonwebtoken")
const passport = require('./passportConfig')
require('dotenv').config()

module.exports = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, verified)=>{

        // If there is a error or the token is not verified
        if(err || !verified){
            return res.status(401).send()
        }

        // Succesfull verification
        req.user = verified
        next()
    })(req, res,next)
}