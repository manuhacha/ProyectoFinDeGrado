const express = require("express");
const router = express.Router();
const { Album } = require("../models/Album");
/**
 * @swagger
 * tags:
 *   name: Albums
 *   description: Endpoint para la gestión de álbumes
 */
/**
 * @swagger
 * /api/v1/album:
 *   get:
 *     summary: Devuelve todos los álbumes
 *     description: Devuelve todos los álbumes de la BBDD
 *     tags: [Albums]
 *     responses:
 *       200:
 *         description: Devuelve los álbumes
 *       400:
 *         description: No hay álbumes
 */
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
/**
 * @swagger
 * /api/v1/album:
 *   post:
 *     summary: Crea un álbum
 *     description: Crea un álbum y lo sube a la bbdd 
 *     tags: [Albums]
 *     parameters:
 *       - in: body
 *         name: album
 *         description: Datos del álbum
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre
 *             artist:
 *               type: string
 *               description: Artista
 *             date:
 *               type: string
 *               description: Fecha
 *             spotifyid:
 *               type: string
 *               description: Id de Spotify
 *     responses:
 *       200:
 *         description: Crea al álbum
 *       400:
 *         description: Error al crear el álbum
 */
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