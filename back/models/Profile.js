const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    newpassword: String
})

const Profile = mongoose.model('profile',profileSchema)

module.exports.Profile = Profile;
module.exports.profileSchema = profileSchema;