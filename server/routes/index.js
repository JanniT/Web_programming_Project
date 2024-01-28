var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
const mongoose = require("mongoose");

const validateToken = require("../middleware/validateToken")
const validateRegister = require("../middleware/validateRegister")
const passportConfig = require("../middleware/passportConfig")

const { body, validationResult } = require('express-validator')

const Users = require("../models/Users")

require('dotenv').config()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' })
})

router.post("/api/user/register/", validateRegister, async(req,res) => {
  //checking if any validation errors occur
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // Extracting the first error to check its type
    const firstError = errors.array()[0]

    if(firstError.path === "password" && firstError.type === "field"){
      return res.status(400).json({ message: firstError.msg })
    }

    // Checking if the error is related to the 'email' field
    if (firstError.path === 'email' && firstError.type === 'field') {
      return res.status(400).json({ message: 'Invalid email', errors: errors.array() })
    }

    return res.status(400).json({ message: 'Password is not strong enough', errors: errors.array() })
  }
  
  const {firstName, surName, email, username, password, age } = req.body

  try {
    // Checking if the username is already in use
    const usernameInUse = await Users.findOne({ username })
    if (usernameInUse) {
      return res.status(403).json({ message: "Username already in use" })
    }

    //Checking first that the email is not already used
    const userExisting = await Users.findOne({ email })

    if (!userExisting){
      //When knowing that the email is free, lets hash the password
      const salt = bcrypt.genSaltSync(10)
      const hashPassword = await bcrypt.hash(password, salt)
      
      // Creating the user with the hashed password and saving it to the database
      const newUser = new Users ({
        "firstName": firstName,
        "surName": surName,
        "username": username,
        "email": email,
        "password": hashPassword,
        "age": age
      })

      await newUser.save()
  
      res.status(200).json({ message: "Registration successful"})
    } else {
      return res.status(403).json({ message: "Email already in use"})
    }
  } catch (error){
    console.error("Error creating user: ", error)
    res.status(500).json({ error: "Internal server error"})
  }
})

module.exports = router
