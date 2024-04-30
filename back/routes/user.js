const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const upload = require("../middleware/file");
const fs = require('fs');
const path = require('path');
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
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const updateddata = req.body;
  let profilepic = null;

  if (req.file && req.file.filename) {
    profilepic = req.protocol + "://" + req.get("host") + "/public/" + req.file.filename;
    updateddata.profilepic = profilepic; // Añadimos la foto a los datos que vamos a actualizar
  }

  try {
    const usernameexists = await User.find({ username: req.body.username });
    const emailexists = await User.find({ email: req.body.email });
    //Vemos si hay otro usuario con ese correo o nombre de usuario
    if ((usernameexists.length > 0 && usernameexists[0]._id.toString() !== id) ||(emailexists.length > 0 && emailexists[0]._id.toString() !== id)
    ) {
      return res.status(400).send("Email or username already exists");
    }

    // Sacamos los datos del usuario por id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Sacamos la foto de perfil que ya tiene
    const haveprofilepic = user.profilepic;

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

    // Actualizamos al usuario
    const updatedUser = await User.findByIdAndUpdate(id, updateddata);

    res.status(200).json("User updated successfully and profilepic = " + profilepic);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
});


module.exports = router;
