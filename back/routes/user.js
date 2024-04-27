const express = require('express');
const router = express.Router();
const {User} = require('../models/User');

router.post('/', async(req,res)=>{

    //Buscamos si existe el correo o el usuario
    let user = await User.findOne({email: req.body.email});
    let usernameexists = await User.findOne({username: req.body.username})

    //Devolvemos error si no existe el correo o usuario
    if (user || usernameexists) return res.status(400).send('Email or username already exists');

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        repeatpassword: req.body.repeatpassword
    })

    //Devolvemos error si las contraseñas no coinciden
    if (req.body.password !== req.body.repeatpassword) {
        return res.status(400).send('Passwords do not match')
    }

    //Si todo sale bien, guardamos el usuario en la base de datos y construimos el token JWT
    else {
        const result = await user.save();
        const jwtToken = user.generateJWT();
        res.status(200).send({jwtToken});
    }
    
})

module.exports = router;