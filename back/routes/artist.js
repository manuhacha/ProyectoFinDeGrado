const express = require("express");
const router = express.Router();
const { Artist } = require("../models/Artist");
/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: Endpoint para la gestión de artistas
 */
/**
 * @swagger
 * /api/v1/artist:
 *   get:
 *     summary: Devuelve todos los artistas
 *     description: Devuelve todos los artistas de la BBDD
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Devuelve los artistas
 *       400:
 *         description: No hay artistas
 */
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
/**
 * @swagger
 * /api/v1/artist:
 *   post:
 *     summary: Crea un artista
 *     description: Crea un artista y lo sube a la bbdd 
 *     tags: [Artists]
 *     parameters:
 *       - in: body
 *         name: artist
 *         description: Datos del artista
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre
 *             genre:
 *               type: string
 *               description: Género
 *             picture:
 *               type: string
 *               description: Foto
 *             link:
 *               type: string
 *               description: Enlace
 *     responses:
 *       200:
 *         description: Crea al artista
 *       400:
 *         description: Error al crear el artista
 */
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
        res.status(400).send("Error saving artists")
      }
    }); 
    
    
module.exports = router;