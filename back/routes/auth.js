const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.post('/',async(req,res)=>{
    const user = await User.findOne({email: req.body.email});
    
    if (user.password !== req.body.password) return res.status(400).send('Username or password are not correct');

    const jwtToken = user.generateJWT();
    res.status(200).send({jwtToken});
})
module.exports = router;