const express = require("express");
const router = express.Router();
const { Artist } = require("../models/Artist");

// Ruta get para obtener todos los artistas
router.get("/", async (req, res) => {
  try {
      let artists = await Artist.find(); // Busca los artistas
      if (artists && artists.length > 0) {
          res.status(200).send(artists); // Si encuentra artistas los envia
      } else {
          res.status(400).send("There are no artists");
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error"); // Manejo de errores
  }
});
//Creamos el método post para subir artistas
router.post("/", async (req, res) => {

    let artist = new Artist({
      name: req.body.name,
      genre: req.body.genre,  
      picture: req.body.picture,
      link: req.body.link
    });
  
      try {
        const result = await artist.save();
        res.status(200).json("Artist saved succesfully");
      }
      catch (error) {
        res.status(400).send("Error savin artists")
      }
    }); 
    
    
module.exports = router;