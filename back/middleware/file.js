const multer = require("multer");
const fs = require('fs');
const path = require('path');
//Creamos el directorio donde se guardarán las fotos
const DIR = "./public/";

//Se define un storage que configura se deben almacenar los archivos
const storage = multer.diskStorage({
  //Definimos que el destino será DIR
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  //Le damos un nombre a la imagen
  filename: (req, file, cb) => {
    const filename =
      Date.now() + "-" + file.originalname.toLowerCase().split(" ").join("-");
    cb(null, filename);
  },
});

//Finalmente subimos la foto al servidor
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only jpg,jpg and png are accepted"));
    }
  },
});

module.exports = upload;

