const verifyEmailRouter = require('./routes/verifyEmail');
const verifyInicioRouter = require('./routes/VerifyInicio');
const orderRoutes = require('./routes/orderRoutes');
// servidor
const express = require('express');  // importamos express
const morgan = require('morgan');    // importamos morgan
const app = express(); // instanciamos express
const indexRoutes = require('./routes/index1'); // importamos indexRoutes
const path = require('path'); // importamos path
const cors = require('cors');
require('dotenv').config();
// configuracion
app.set('port', process.env.PORT || 3000); // puerto
// middlewares
app.use(morgan('dev')); // morgan
app.use(cors());
app.use(express.json()); // para que express entienda json
// routes
app.use('/api', indexRoutes); // rutas
app.use('/api', orderRoutes);
app.use('/uploads', express.static(path.resolve('uploads'))); // para que se pueda acceder a la carpeta uploads desde el navegador

app.use('/api/verify-inicio', verifyInicioRouter);
app.use('/api/verify-email', verifyEmailRouter);
app.use('/api', require('./routes/index.js'));

// exportamos app
module.exports = app;