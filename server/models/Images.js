const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    encoding: String,
    mimetype: String,
    buffer: Buffer,
})

const images = mongoose.model('images', imageSchema)
module.exports = images