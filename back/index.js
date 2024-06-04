const express = require('express');
const mongoose = require('mongoose');
const user = require('../back/routes/user');
const auth = require('../back/routes/auth');
const album = require('../back/routes/album');
const artist = require('../back/routes/artist')
const communityalbums = require('../back/routes/communityalbums')
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(cors());
app.use(express.json());

// Definimos las opciones de configuración para Swagger
const options = {
    swaggerDefinition: {
        info: {
            title: 'Documentación API The Dark Library',
            version: '1.0.0',
            description: 'En esta documentación encontraras la información básica del funcionamiento de la API',
        },
    },
    apis: ['./routes/*.js'], // Rutas donde se encuentran tus definiciones Swagger
};
const specs = swaggerJsdoc(options);

//Definimos las rutas de la API
app.use('/api/v1/user/', user);
app.use('/api/v1/auth/', auth);
app.use('/api/v1/album/', album);
app.use('/api/v1/artist/',artist);
app.use('/api/v1/communityalbums/',communityalbums)
app.use('/public',express.static('public'));
// Usa Swagger UI en una ruta específica
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));




//Ponemos el puerto que queremos
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Listening on port: '+ port));
console.log('Swagger hosted on: http://localhost:3000/api-docs')

//Conexion con base de datos MongoDB
mongoose.connect('mongodb://localhost/TFG', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));
