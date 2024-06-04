const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const auth = require('../middleware/auth');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de Usuario
 */
/**
 * @swagger
 * /api/v1/auth:
 *   post:
 *     summary: Loggea a un Usuario
 *     description: Loggea a un Usuario y devuelve el token JWT
 *     tags: [Auth]
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Datos del usuario para autenticación
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 *             password:
 *               type: string
 *               description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Devuelve el token JWT
 *       400:
 *         description: El usuario no existe o las credenciales son incorrectas
 */
//Método para autenticar al usuario
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
/**
 * @swagger
 * /api/v1/auth:
 *   get:
 *     summary: Devuelve la informacion de un usuario
 *     description: Devuelve la informacion de un usuario a partir de su JWT
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorizations
 *         description: Token del usuario
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <token>
 *     responses:
 *       200:
 *         description: Devuelve la información
 *       400:
 *         description: No encuentra al usuario
 */
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