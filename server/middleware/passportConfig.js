const jwt = require("jsonwebtoken")
const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt
const Users = require("../models/Users")
require('dotenv').config()
passport.initialize()

// options for the passport
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
}

// passport uses jwt strategy
passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
      try {
        // console.log("Payload from the token: ", payload)
        // finding the user from the db
        const user = await Users.findOne( {email: payload.email })
  
        if (user){
          return done(null, user) //succesfull 
        } else {
          return done(null, false)  //authentication fails
        }
      } catch (error){
        return done(error, false)
      }
    })
)

module.exports = passport