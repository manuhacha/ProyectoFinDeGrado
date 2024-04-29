const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const upload = require("../middleware/file");
const deletePhoto = require("../middleware/file");
//Hacemos el get para poder obtener los datos del cliente, y mirar si su contraseña antigua es correcta, por ejemplo, al actualizar el usuario
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let user = await User.findOne({ email: email });

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send("User does not exists");
    }
  } catch (error) {
    console.log(error);
  }
});

//Creamos el método post para registrar un usuario
router.post("/", async (req, res) => {
  //Buscamos si existe el correo o el usuario
  let user = await User.findOne({ email: req.body.email });
  let usernameexists = await User.findOne({ username: req.body.username });

  //Devolvemos error si no existe el correo o usuario
  if (user || usernameexists)
    return res.status(400).send("Email or username already exists");

  user = new User({
    profilepicture: req.body.profilepicture,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    repeatpassword: req.body.repeatpassword,
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
//Creamos la ruta put para actualizar los datos del usuario, que gestionaremos en el apartado de profile
router.put("/:id",upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { password, username, email } = req.body;
  let profilepic = null;
  const url = req.protocol + "://" + req.get("host");
  if (req.file.filename) {
    profilepic = url + "/public/" + req.file.filename;
  }
  try {
    const usernameexists = await User.find({ username: req.body.username });
    const emailexists = await User.find({ email: req.body.email });
    const tienefoto = await User.find({profilepic: profilepic,email: req.body.email})
    //Vemos si ese email o nombre de usuario existen, si es así, devolvemos el error
    if (usernameexists.length > 1) {
      return res.status(400).send("Username already exists");
    }
    if (emailexists.length > 1) {
      return res.status(400).send("Email already exists");
    }
    //Si tiene una foto asignada, borramos la foto anterior antes de añadir la nueva
    if (tienefoto) {
      deletePhoto(req.file.filename)
    }
    // Busca al usuario por id
    const user = await User.findByIdAndUpdate(id, {
      password,
      username,
      email,
      profilepic
    });

    //Mira si existe el usuario y si no devuelve error
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      //Actualiza el usuario y devuelve el mensaje de éxito
      res.status(200).json("User updated succesfully and profilepic = " + profilepic);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});

module.exports = router;
