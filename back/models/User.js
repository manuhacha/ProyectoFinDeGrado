const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//Creamos la tabla Usuario con los campos necesarios
const userSchema = new mongoose.Schema({
    profilepicture: String,
    username: String,
    email: String,
    password: String,
})

//Generamos el token jwt basandonos en el id, el usuario y el correo, aplicándole nuestra clave secreta
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