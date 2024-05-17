const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const auth = require('../middleware/auth')
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
//Metodo get para obtener usuario a partir del token, pasando por nuestro middleware auth
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;