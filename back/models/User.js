const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

userSchema.methods.generateJWT = function() {
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },"secretKey")
}

const User = mongoose.model('user',userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;