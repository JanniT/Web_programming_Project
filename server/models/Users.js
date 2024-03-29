const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: String,
    surName: String,
    email: String,
    username: String,
    password: String,
    age: Number,
    bio: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isAdmin: { type: Boolean, default: false }
})
const User = mongoose.model('User', userSchema)
module.exports = User