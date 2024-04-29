const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/',async(req,res)=>{
    const user = await User.findOne({email: req.body.email});
    
    //Verificamos si el usuario existe, y dentro si las contraseñas coinciden, si no se devuelve error
    if (user) {
        if (user.password !== req.body.password) return res.status(400).send('Username or password are not correct');

        const jwtToken = user.generateJWT();
        res.status(200).send({jwtToken});
    }
    else {
        res.status(400).send('User does not exist')
    }
})
module.exports = router;