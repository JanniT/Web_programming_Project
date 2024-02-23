var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const User = require('./models/Users')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()
app.use(cors())

if (process.env.NODE_ENV === "development") {
    var cors = {
        origin: "http://localhost:3000/",
        optionsSuccessStatus: 200,
    }
    app.use(cors(corsOptions))
}

// Creating the database connection
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))
db.on("connected", console.error.bind(console, "MongoDB connect established"))

// Admin account creation
const createAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@example.com' })
        if (!existingAdmin) {
            // Hash the password before saving
            const hashedPassword = await bcrypt.hash('adminPassword!1', 10)

            const admin = new User({
                email: 'admin@example.com',
                password: hashedPassword, 
                isAdmin: true
            })
            await admin.save()
            console.log('Admin account created successfully:', admin)
        } else {
            console.log('Admin account already exists.')
        }
    } catch (error) {
        console.error('Error creating admin account:', error)
    }
}

createAdmin()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app