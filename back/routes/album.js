const express = require("express");
const router = express.Router();
const { Album } = require("../models/Album");

// Ruta get para obtener todos los albumes
router.get("/", async (req, res) => {
  try {
      let albums = await Album.find(); // Busca los albumes
      if (albums && albums.length > 0) {
          res.status(200).send(albums); // Si encuentra albumes los envia
      } else {
          res.status(400).send("There are no albums");
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error"); // Manejo de errores
  }
});
//Creamos el método post para subir albumes
router.post("/", async (req, res) => {

    let album = new Album({
      name: req.body.name,
      artist: req.body.artist,
      date: req.body.date,
      picture: req.body.picture,
      spotifyid: req.body.spotifyid
    });
  
      try {
        const result = await album.save();
        res.status(200).json("Album saved succesfully")
      }
      catch (error) {
        res.status(400).send("Error creating album")
      }
    }); 
    
    
module.exports = router;