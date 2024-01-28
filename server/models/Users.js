const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    surName: String,
    email: String,
    username: String,
    password: String,
    age: Number,
});

const User = mongoose.model('User', userSchema)

module.exports = User