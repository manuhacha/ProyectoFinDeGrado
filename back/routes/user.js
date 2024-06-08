const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const upload = require("../middleware/file");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const crypto = require("crypto");
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoint para la gestión de usuarios
 */
/**
/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario y lo guarda en la base de datos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: body
 *         name: usuario
 *         description: Datos del usuario
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: Nombre de Usuario
 *             email:
 *               type: string
 *               description: Email
 *             password: 
 *               type: string
 *               description: Contraseña
 *             repeatpassword:
 *               type: string
 *               description: Repetir contraseña
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jwtToken:
 *                   type: string
 *       400:
 *         description: Error al registrar el usuario
 */
//Creamos el método post para registrar un usuario
router.post("/", async (req, res) => {
  //Buscamos si existe el correo o el usuario
  let user = await User.findOne({ email: req.body.email });
  let usernameexists = await User.findOne({ username: req.body.username });
  let encryptedPassword = "";
  //Devolvemos error si no existe el correo o usuario
  if (user || usernameexists)
    return res.status(400).send("Email or username already exists");

  //Encriptamos la contraseña
  encryptedPassword = encryptPassword(req.body.password);

  //Creamos el usuario nuevo
  user = new User({
    profilepicture: req.body.profilepicture,
    username: req.body.username,
    email: req.body.email,
    password: encryptedPassword,
  });

  //Devolvemos error si las contraseñas no coinciden
  if (req.body.password !== req.body.repeatpassword) {
    return res.status(400).send("Passwords do not match");
  }

  //Si todo sale bien, guardamos el usuario en la base de datos y construimos el token JWT
  else {
    const result = await user.save();
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  }
});
/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Actualiza usuario
 *     description: Actualiza usuario en la bbdd
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: Id del usuario
 *         required: true
 *         type: string
 *       - in: body
 *         name: usuario
 *         description: Datos del usuario
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             profilepicture:
 *               type: string
 *               description: Foto de perfil
 *             username:
 *               type: string
 *               description: Nombre de Usuario
 *             email:
 *               type: string
 *               description: Email
 *             oldpassword:
 *               type: string
 *               description: Contraseña antigua
 *             password:
 *               type: string
 *               description: Contraseña nueva
 *             repeatnewpassword:
 *               type: string
 *               description: Repetir contraseña nueva
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Error al actualizar el usuario
 */
//Creamos la ruta put para actualizar los datos del usuario, que gestionaremos en el apartado de profile
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const updateddata = req.body;
  let profilepic = null;
  let encryptedPassword = "";
  try {
    const usernameexists = await User.find({ username: req.body.username });
    const emailexists = await User.find({ email: req.body.email });

    //Vemos si hay otro usuario con ese correo o nombre de usuario
    if (
      (usernameexists.length > 0 && usernameexists[0]._id.toString() !== id) ||
      (emailexists.length > 0 && emailexists[0]._id.toString() !== id)
    ) {
      return res.status(400).send("Email or username already exists");
    }
    // Sacamos los datos del usuario por id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    //Comprobamos las contraseñas
    if (req.body.oldpassword) {
      if (req.body.password !== req.body.repeatnewpassword) {
        return res.status(400).send("Passwords do not match");
      }
      if (req.body.oldpassword !== decryptPassword(user.password)) {
        return res.status(400).send("Old password is incorrect");
      }
      if (!req.body.password || !req.body.repeatnewpassword) {
        return res.status(400).send("New password is blank");
      } else {
        //Ciframos la contraseña
        updateddata.password = encryptPassword(req.body.password);
      }
    }
    //Si no ha rellenado contraseñas, se autocompletan con las que ya tiene
    if (!req.body.oldpassword) {
      user.password = decryptPassword(user.password);
      updateddata.password = encryptPassword(user.password);
    }

    // Sacamos la foto de perfil que ya tiene
    const haveprofilepic = user.profilepic;

    if (req.file && req.file.filename) {
      profilepic =
        req.protocol + "://" + req.get("host") + "/public/" + req.file.filename;
      updateddata.profilepic = profilepic; // Añadimos la foto a los datos que vamos a actualizar
      // Vemos si el usuario tiene una foto de perfil ya asignada
      if (haveprofilepic && haveprofilepic !== profilepic) {
        // Sacamos el nombre del archivo
        const filename = haveprofilepic.split("/").pop();
        // Contruimos la ruta del archivo
        const filePath = path.join(__dirname, "../public", filename);

        // Borramos la foto
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
    }

    // Actualizamos al usuario y enviamos todos los datos, o sin las contraseñas si no ha querido cambiarla
    const updatedUser = await User.findByIdAndUpdate(id, updateddata);
    res.status(200).json("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

//Método para cifrar la contraseña con AES 256
function encryptPassword(password) {
  const cipher = crypto.createCipher("aes256", process.env.key);
  const encryptedPassword =
    cipher.update(password, "utf8", "hex") + cipher.final("hex");
  return encryptedPassword;
}
function decryptPassword(encryptedPassword) {
  const decipher = crypto.createDecipher("aes256", process.env.key);
  const decryptedPassword =
    decipher.update(encryptedPassword, "hex", "utf8") + decipher.final("utf8");
  return decryptedPassword;
}

module.exports = router;
