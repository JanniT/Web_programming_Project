var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require("cors")
const mongoose = require("mongoose")

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

if (process.env.NODE_ENV === "developmnet") {
    var cors = {
        origin: "http://localhost:3000/",
        optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions))
}

// Creating the database connection
const mongoDB = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))
db.on("connected", console.error.bind(console, "MongoDB connect established"))

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;