const express = require('express');
const router = express.Router();
const {User} = require('../models/User');

router.post('/', async(req,res)=>{
    let user = await User.findOne({email: req.body.email});

    if (user) return res.status(400).send('Email already exists');

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        repeatpassword: req.body.repeatpassword
    })

    if (req.body.password !== req.body.repeatpassword) {
        return res.status(400).send('Passwords do not match')
    }

    else {
        const result = await user.save();
        const jwtToken = user.generateJWT();
        res.status(200).send({jwtToken});
    }
    
})

module.exports = router;