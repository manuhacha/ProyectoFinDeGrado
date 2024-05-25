const mongoose = require('mongoose');

const communityalbumsSchema = new mongoose.Schema({
    name: String,
    artist: String,
    date: String,
    picture: String,
    spotifyid: String,
    userid: String
})

const CommunityAlbums = mongoose.model('communityalbums',communityalbumsSchema)

module.exports.CommunityAlbums = CommunityAlbums
module.exports.communityalbumsSchema = communityalbumsSchema