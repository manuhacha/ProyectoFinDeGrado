const express = require('express');
const mongoose = require('mongoose');
const user = require('../back/routes/user');
const auth = require('../back/routes/auth');
const album = require('../back/routes/album');
const artist = require('../back/routes/artist')
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
//Definimos las rutas de la API
app.use('/api/v1/user/', user);
app.use('/api/v1/auth/', auth);
app.use('/api/v1/album/', album);
app.use('/api/v1/artist/',artist)
app.use('/public',express.static('public'));

//Ponemos el puerto que queremos
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Listening on port: '+ port));

//Conexion con base de datos MongoDB
mongoose.connect('mongodb://localhost/TFG', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));
