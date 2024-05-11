const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: String,
    artist: String,
    date: Date,
    picture: String
})

const Album = mongoose.model('albums',albumSchema)

module.exports.Album = Album
module.exports.albumSchema = albumSchema