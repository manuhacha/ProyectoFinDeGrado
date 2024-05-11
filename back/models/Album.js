const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    name: String,
    artist: String,
    year: String,
    picture: String
})

const Album = mongoose.model('albums',albumSchema)

module.exports.Album = Album
module.exports.albumSchema = albumSchema