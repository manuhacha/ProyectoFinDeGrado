const express = require("express");
const router = express.Router();
const { CommunityAlbums } = require("../models/CommunityAlbums");
/**
 * @swagger
 * tags:
 *   name: CommunityAlbums
 *   description: Endpoint para la gestión de álbumes de la comunidad
 */
/**
 * @swagger
 * /api/v1/communityalbums:
 *   get:
 *     summary: Devuelve todos los álbumes de la comunidad
 *     description: Devuelve todos los álbumes de la comunidad de la BBDD
 *     tags: [CommunityAlbums]
 *     responses:
 *       200:
 *         description: Devuelve los álbumes de la comunidad
 *       400:
 *         description: No hay álbumes de la comunidad
 */
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
/**
 * @swagger
 * /api/v1/communityalbums/{userId}:
 *   get:
 *     summary: Devuelve los albumes de la comunidad
 *     description: Devuelve los albumes de la comunidad por id
 *     tags: [CommunityAlbums]
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: Id del usuario
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Devuelve el álbum
 *       400:
 *         description: El usuario no tiene álbumes*
 */
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
/**
 * @swagger
 * /api/v1/communityalbums:
 *   post:
 *     summary: Crea un album de la comunidad
 *     description: Crea un album de la comunidad y lo sube a la bbdd
 *     tags: [CommunityAlbums]
 *     parameters:
 *       - in: body
 *         name: communityalbum
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
 *             picture: 
 *               type: string
 *               description: Foto
 *             spotifyid:
 *               type: string
 *               description: Id de Spotify
 *             userid:
 *               type: string
 *               description: Id de Usuario
 *             link:
 *               type: string
 *               description: Enlace
 *     responses:
 *       200:
 *         description: El álbum se ha creado
 *       400:
 *         description: Erroral crear el álbum
 */
//Creamos el método post para subir albumes
router.post("/", async (req, res) => {

  let hasanalbum = await CommunityAlbums.findOne({ userid: req.body.userid });
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
      userid: req.body.userid,
      link: req.body.link
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
    /**
 * @swagger
 * /api/v1/communityalbums/{id}:
 *   delete:
 *     summary: Borra un Álbum de la Comunidad
 *     description: 
 *     tags: [CommunityAlbums]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Id del álbum
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Se ha borrado el álbum
 *       400:
 *         description: Error al borrar el álbum
 */
    //Metodo para borrar el usuario
    router.delete('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deletedAlbum = await CommunityAlbums.findByIdAndDelete(id);
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