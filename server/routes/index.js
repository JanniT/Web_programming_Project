var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')

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

// HANDLING THE LOGIN 
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Finding the user from the database via the email
    const user = await Users.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Compare the provided password with the hashed password in the database
    const matchingPassword = await bcrypt.compare(password, user.password)

    if (matchingPassword) {
      // Creating a JWT token with the email in the payload
      const token = jwt.sign({ email: user.email }, process.env.SECRET, {
        expiresIn: '1h', 
      })

      res.status(200).json({ success: true, token })
    } else {
      res.status(401).json({ message: 'Invalid password' })
    }
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

//HANDLING THE DASHBOARD (PRIVATE ROUTE)
router.get("/profile", validateToken, async (req,res) => {
  try {
    // Fetching user details from the database based on the email stored in the token
    const user = await Users.findOne({ email: req.user.email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Returning the user info
    res.status(200).json({
      firstName: user.firstName,
      surName: user.surName,
      username: user.username,
      email: user.email,
      age: user.age,
      bio: user.bio,
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE DASHBOARD DATA FETCHING
router.get("/dashboard", validateToken, async (req, res) => {
  try {
    // Fetching all users from the database except the currently signed-in user
    const users = await Users.find({ email: { $ne: req.user.email } }).limit(10)

    // Returning the user info
    res.status(200).json(users.map(user => ({
      data: user,
    })))
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// UPDATING THE USER BIO WITH PATCH
router.patch("/user/bio", validateToken, async (req, res) => {
  try {
    // Fetching user details from the database based on the email stored in the token
    const user = await Users.findOneAndUpdate(
      { email: req.user.email },
      { $set: { bio: req.body.bio } },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Returning the updated user info
    res.status(200).json({
      firstName: user.firstName,
      surName: user.surName,
      username: user.username,
      email: user.email,
      age: user.age,
      bio: user.bio,
    })
  } catch (error) {
    console.error('Error updating user details:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE REGISTRATION
router.post("/user/register/", validateRegister, async(req,res) => {
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
