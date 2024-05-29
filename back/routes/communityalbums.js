const express = require("express");
const router = express.Router();
const { CommunityAlbums } = require("../models/CommunityAlbums");

// Ruta get para obtener todos los albumes
router.get("/", async (req, res) => {
  try {
      let communityalbums = await CommunityAlbums.find(); // Busca los albumes
      if (communityalbums && communityalbums.length > 0) {
          res.status(200).send(communityalbums); // Si encuentra albumes los envia
      } else {
          res.status(400).send("There are no albums");
      }
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error"); // Manejo de errores
  }
});

//Hacemos el get para poder obtener los albumes de un usuario específico
router.get("/:userid", async (req, res) => {
    try {
      const { userid } = req.params;
      let communityalbums = await CommunityAlbums.findOne({ userid: userid });
  
      if (communityalbums) {
        res.status(200).send(communityalbums);
      } else {
        res.status(400).send("This user doesnt have any albums");
      }
    } catch (error) {
      console.log(error);
    }
  });

//Creamos el método post para subir albumes
router.post("/", async (req, res) => {

  let hasanalbum = await CommunityAlbums.findOne({ userid: req.body.userid });

  console.log(hasanalbum)
  //Vemos si el usuario ya tiene un album
  if (hasanalbum) {
    res.status(400).json("You already have an album uploaded")
  }
  //Si no lo tiene, lo creamos
  else {

    let communityalbums = new CommunityAlbums({
      name: req.body.name,
      artist: req.body.artist,
      date: req.body.date,
      picture: req.body.picture,
      spotifyid: req.body.spotifyid,
      userid: req.body.userid
    });
  
      try {
        const result = await communityalbums.save();
        res.status(200).json("Album saved succesfully")
      }
      catch (error) {
        res.status(400).send("Error creating album")
      }
  }
    }); 
    //Metodo para borrar el usuario
    router.delete('/:userid', async (req, res) => {
      try {
        const userId = req.params;
        const deletedAlbum = await CommunityAlbums.findByIdAndDelete(userId);
        //Si no existe ese usuario, cosa que no debería de pasar nunca, le enviamos este error
        if (!deletedAlbum) {
          return res.status(404).json("User not found");
        }
    
        res.status(200).json("Album deleted successfully");
      } catch (error) {
        res.status(500).json("Error deleting Album");
      }
    });

module.exports = router;