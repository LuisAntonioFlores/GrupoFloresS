// servidor
const express = require('express');  // importamos express
const morgan = require('morgan');    // importamos morgan
const app = express(); // instanciamos express
const indexRoutes = require('./routes/index'); // importamos indexRoutes
const path = require('path'); // importamos path
const cors = require('cors');
// configuracion
app.set('port', process.env.PORT || 4000); // puerto
// middlewares
app.use(morgan('dev')); // morgan
app.use(cors());
app.use(express.json()); // para que express entienda json
// routes
app.use('/api', indexRoutes); // rutas
app.use('/uploads', express.static(path.resolve('uploads'))); // para que se pueda acceder a la carpeta uploads desde el navegador
// exportamos app
module.exports = app;