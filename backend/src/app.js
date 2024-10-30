const verifyEmailRouter = require('./routes/verifyEmail');
const verifyInicioRouter = require('./routes/VerifyInicio');
const orderRoutes = require('./routes/orderRoutes');

const routes = require('./routes'); // Ajusta la ruta a tu archivo de rutas
// servidor
const express = require('express');  // importamos express
const morgan = require('morgan');    // importamos morgan
const app = express(); // instanciamos express
const indexRoutes = require('./routes/index1'); // importamos indexRoutes
const path = require('path'); // importamos path
const cors = require('cors');
const meruta = require('./routes/mercadoruta.js');
const direccionRoutes = require('./routes/Direccion');


require('dotenv').config();
app.use(morgan('dev')); // morgan
app.use(cors());
app.use(express.json()); // debe estar al inicio antes de las rutas 

app.use('/api/direccion', direccionRoutes);

// configuracion
app.set('port', process.env.PORT || 3000); // puerto
// middlewares


 // para que express entienda json
// routes
app.use('/api', indexRoutes); // rutas
app.use('/api', orderRoutes);
app.use('/uploads', express.static(path.resolve('uploads'))); // para que se pueda acceder a la carpeta uploads desde el navegador


// Ruta para Mercado Pago
app.use('/api/pago', meruta);
app.use('/api/verify-inicio', verifyInicioRouter);
app.use('/api/verify-email', verifyEmailRouter);
app.use('/api', require('./routes/index.js'));


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de la API'); // Respuesta simple
});


module.exports = app;