const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: String,
    genre: String,
    picture: String,
    link: String
})

const Artist = mongoose.model('artists',artistSchema)

module.exports.Artist = Artist
module.exports.artistSchema = artistSchema