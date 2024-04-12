const express = require('express');
const mongoose = require('mongoose');
const user = require('../back/routes/user');
const auth = require('../back/routes/auth');
const task = require('../back/routes/task');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user/', user);
app.use('/api/auth/', auth);
app.use('/api/task/', task);
app.use('/public',express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Listening on port: '+ port));

mongoose.connect('mongodb://localhost/TFG', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));
