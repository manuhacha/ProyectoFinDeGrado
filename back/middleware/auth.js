const jwt = require('jsonwebtoken');

function auth(req,res,next) {
    let jwtToken = req.header('Authorization');
    if (!jwtToken) return res.status(401).send('Denied access');
    jwtToken = jwtToken.split(' ')[1]
    if (!jwtToken) return res.status(401).send('Denied access');

    try {
        const payload = jwt.verify(jwtToken,'secretKey')
        req.user = payload;
        next();
    } catch (error) {
        res.status(400).send('Denied Access. Not a valid token');
    }
}

module.exports = auth;