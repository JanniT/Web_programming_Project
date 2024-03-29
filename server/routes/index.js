var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const multer = require('multer')

const validateToken = require("../middleware/validateToken")
const validateRegister = require("../middleware/validateRegister")
const passportConfig = require("../middleware/passportConfig")

const { body, validationResult } = require('express-validator')

const Users = require("../models/Users")
const Chats = require("../models/Chats")
const Images = require("../models/Images")

require('dotenv').config()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' })
})

// Multer configuration for storing images
const storage = multer.memoryStorage()
const upload = multer({ storage })

// HANDLING THE REGISTRATION
router.post("/user/register/", upload.single('picture'), validateRegister, async(req,res) => {
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
        "age": age,
        "isAdmin": false
      })

      await newUser.save()

      // Saving the profile picture
      if (req.file) {
        const { originalname, mimetype, buffer } = req.file
        const newImage = new Images({
            userId: newUser._id,
            name: originalname,
            encoding: 'base64',
            mimetype,
            buffer
        })
        await newImage.save()
      }
  
      res.status(200).json({ message: "Registration successful"})
    } else {
      return res.status(403).json({ message: "Email already in use"})
    }
  } catch (error){
    console.error("Error creating user: ", error)
    res.status(500).json({ error: "Internal server error"})
  }
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

      // Check if the user is an admin
      if (user && user.isAdmin) {
        // If the user is an admin, set isAdmin to true in the response
        res.json({ token, userId: user._id, isAdmin: true })
      } else {
          res.json({ token, userId: user._id, isAdmin: false })
      }
    } else {
      res.status(401).json({ message: 'Invalid password' })
    }
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

//HANDLING THE USERDATA FETCHING FOR THE PROFILE
router.get("/profile", validateToken, async (req,res) => {
  try {
    // Fetching user details from the database based on the email stored in the token
    const user = await Users.findOne({ email: req.user.email })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user is an admin, and if so, return an empty response
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Returning the user info
    res.status(200).json({
      _id: user._id,
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

// HANDLING THE IMAGE FETCHING FOR PROFILE
router.get('/user/image/fetching', validateToken, async (req, res) => {
  try {
    const userId = req.user._id
    
    // Find the user's image in the database
    const image = await Images.findOne({ userId })

    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }

    // Check if the user is an admin, and if so, return an empty response
    const user = await Users.findById(userId)
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Set appropriate headers
    res.set('Content-Type', image.mimetype)
    res.send(image.buffer)
  } catch (error) {
    console.error('Error fetching user image:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE NEW PROFILE IMAGE UPLOAD
router.post('/user/image', validateToken, upload.single('picture'), async (req, res) => {
  try {
      // Checking if file is uploaded
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' })
      }

      const userId = req.user._id

      // Checking if the user already has a profile picture
      const existingImage = await Images.findOne({ userId })

      // If the user has an existing profile picture, update it
      if (existingImage) {
          existingImage.name = req.file.originalname
          existingImage.encoding = 'base64'
          existingImage.mimetype = req.file.mimetype
          existingImage.buffer = req.file.buffer
          await existingImage.save()
          return res.status(200).json({ message: 'Profile picture updated successfully' })
      }

      // If the user does not have an existing profile picture, save a new one
      const newImage = new Images({
          userId,
          name: req.file.originalname,
          encoding: 'base64',
          mimetype: req.file.mimetype,
          buffer: req.file.buffer
      })
      await newImage.save()
      res.status(200).json({ message: 'Profile picture saved successfully' })
  } catch (error) {
      console.error('Error saving profile picture:', error)
      res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// FETCHING DASHBOARD IMAGES
router.get('/user/image/:userId', validateToken, async (req, res) => {
  try {
    const userId = req.params.userId

    // Finding the user's image in the database based via ID
    const image = await Images.findOne({ userId })

    if (!image) {
      return res.status(404).json({ message: 'Image not found' })
    }

    // Check if the user is an admin, and if so, return an empty response
    const user = await Users.findById(userId)
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    res.set('Content-Type', image.mimetype)
    res.send(image.buffer)
  } catch (error) {
    console.error('Error fetching user image:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE DASHBOARD USERDATA FETCHING
router.get("/dashboard", validateToken, async (req, res) => {
  try {
    const currentUser = await Users.findById(req.user._id)

    // Check if the current user is an admin, and if so, return an empty response
    if (currentUser.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    // Fetching all users from the database except the currently signed-in user & the ones interacted with
    const users = await Users.find({
      _id: { $ne: req.user._id, $nin: [...currentUser.likes, ...currentUser.dislikes, ...currentUser.matches] },
      isAdmin: false 
    }).limit(10)

    // Returning the user info along with the current user's ID
    res.status(200).json(users.map(user => ({
      data: user,
      currentUserId: currentUser._id
    })))
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE LIKE / DISLIKE INTERACTIONS
router.post("/interaction", validateToken, async (req, res) => {
  try {
    const { userId, action } = req.body
    const currentUser = await Users.findById(req.user._id)
    const targetUser = await Users.findById(userId)

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    if (action === "like") {
      currentUser.likes.push(userId)
      await currentUser.save()

        // Check if both users have liked each other
      if (targetUser.likes.includes(req.user._id)) {
        currentUser.matches.push(userId)
        targetUser.matches.push(req.user._id)
        await currentUser.save()
        await targetUser.save()
        return res.status(200).json({ matched: true })
      } else {
        // Not matched
        return res.status(200).json({ matched: false })
      }
    } else if (action === "dislike") {
      currentUser.dislikes.push(userId)
      await currentUser.save()
      return res.status(200).json({ message: "User disliked successfully" })
    } else {
      return res.status(400).json({ message: "Invalid action" })
    }
  } catch (error) {
    console.error("Error handling interaction:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
})

// HANDLING THE MATCH FETCHING
router.get("/matches", validateToken, async (req, res) => {
  try {
    const currentUser = await Users.findById(req.user._id)

    // Check if the current user is an admin, and if so, return an empty response
    if (currentUser.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    
    // Fetching users whose IDs are in the matches of the current user
    const matchedUsers = await Users.find({
      _id: { $in: currentUser.matches } 
    })

    // Extract necessary data from matched users
    const matchedUsersData = matchedUsers.map(user => ({
      userId: user._id,
      userName: user.username
    }))

    // Respond with the matched users data
    res.status(200).json({ matches: matchedUsersData })
  } catch (error) {
    console.error('Error fetching matched users:', error)
    res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE MESSAGE FETCHING
router.get("/messages/:userId", validateToken, async (req, res) => {
  try {
      const { userId } = req.params

      // Find the chat between the current user and the specified user
      const chat = await Chats.findOne({ users: { $all: [req.user._id, userId] } })

      // If no chat is found, return an empty array
      const messages = chat ? chat.messages : []

      res.status(200).json({ messages })
  } catch (error) {
      console.error('Error fetching messages:', error)
      res.status(500).json({ message: 'Internal server error', error: error.message })
  }
})

// HANDLING THE MESSAGE SENDING
router.post("/message", validateToken, async (req, res) => {
  try {
      const { userId, content } = req.body

      // Find the chat between the current user and the recipient
      let chat = await Chats.findOne({ users: { $all: [req.user._id, userId] } })

      // If no chat exists, create a new one
      if (!chat) {
          chat = new Chats({ users: [req.user._id, userId], messages: [] })
      }

      // Add the new message to the chat with content
      chat.messages.push({ sender: req.user._id, content })
      await chat.save()

      res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
      console.error('Error sending message:', error)
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
      message: 'User bio updated successfully',
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

// HANDLING THE USER ACCOUNT DELETING
router.delete('/settings/delete/:userId', async (req, res) => {
  try {
    const userId = req.params.userId

    // Find the user to get the picture filename
    const user = await Users.findById(userId)
    
    // Delete user from Users collection
    await Users.findByIdAndDelete(userId)

    // Delete associated chats from Chats collection
    await Chats.deleteMany({ userId: userId })
    
    // Delete the user's image from the Images collection if it exists
    if (user) {
      await Images.deleteOne({ userId: userId })
    }
    res.status(200).json({ message: 'User and associated data deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Failed to delete user. Please try again later.' })
  }
})

// UPDATING USER EMAIL
router.put('/settings/email/:userId', [
  body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Invalid email address.')
  ], async (req, res) => {
    const userId = req.params.userId
    const { email } = req.body

  try {
    // Validate email
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg })
    }

    // Check if email already exists
    const existingUser = await Users.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = await Users.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.email = email
    await user.save()

    res.json({ message: 'Email updated successfully', user })
  } catch (error) {
    console.error('Error updating email:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// PUT UPDATING USER AGE
router.put('/settings/age/:userId', [
  body('age')
      .notEmpty()
      .withMessage('Age is required')
      .isInt({ min: 18, max: 100 })
      .withMessage('Enter valid positive age')
], async (req, res) => {
  const userId = req.params.userId
  const { age } = req.body

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg })
    }
    
    const user = await Users.findById(userId)
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    user.age = age
    await user.save()

    res.json({ message: 'Age updated successfully', user })
  } catch (error) {
    console.error('Error updating age:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// HANDLING THE ADMIN USER FETCHING
router.get('/admin/dashboard', validateToken, async function(req, res, next){
  try {
    // Fetch all users from the database
    const users = await Users.find({ isAdmin: false })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// DELETE USER BY ID ADMIN
router.delete('/admin/users/:userId', validateToken, async (req, res) => {
  try {
    const userId = req.params.userId

    // Find the user to get the picture filename
    const user = await Users.findById(userId)
    
    // Delete user from Users collection
    await Users.findByIdAndDelete(userId)

    // Delete associated chats from Chats collection
    await Chats.deleteMany({ userId: userId })
    
    // Delete the user's image from the Images collection if it exists
    if (user) {
      await Images.deleteOne({ userId: userId })
    }

    res.status(200).json({ message: 'User and associated chats deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// PUT update user bio by ID
router.put('/admin/users/:userId/bio', validateToken, async (req, res) => {
  try {
    const userId = req.params.userId
    const { bio } = req.body

    // Update user's bio in the database
    const updatedUser = await Users.findByIdAndUpdate(userId, { bio: bio }, { new: true })

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('Error updating user bio:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router