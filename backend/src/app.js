const express = require('express');  // importamos express
const morgan = require('morgan');    // importamos morgan
const path = require('path'); // importamos path
const cors = require('cors');

const http = require('http');

const { setupSocketServer } = require('./controllers/socket.js');

const contactoRoutes = require('./routes/quejasrutas');



const notificationRoutes = require('./routes/notificationRoutes.js');
const verifyEmailRouter = require('./routes/verifyEmail');
const verifyInicioRouter = require('./routes/VerifyInicio');
const orderRoutes = require('./routes/orderRoutes');
const indexRoutes = require('./routes/index1'); // importamos indexRoutes
const meruta = require('./routes/mercadoruta.js');
const direccionRoutes = require('./routes/Direccion');
const userRoutes = require('./routes/UserRoutes.js'); 



require('dotenv').config();
const app = express(); // instanciamos express
const server = http.createServer(app);  // Crear el servidor HTTP que envuelve a Express

app.use(morgan('dev')); // morgan
app.use(cors());
app.use(express.json()); // debe estar al inicio antes de las rutas 

app.set('port', process.env.PORT ); // puerto

//configiracion de rutas
app.use('/api/notifications', notificationRoutes);  
app.use('/api/informes', contactoRoutes); 
app.use('/api', indexRoutes); // rutas
app.use('/api', orderRoutes);
app.use('/api/direccion', direccionRoutes);

app.use('/uploads', express.static(path.resolve('uploads'))); 

// para que se pueda acceder a la carpeta uploads desde el navegador
app.use('/api/pago', meruta);
app.use('/api/verify-inicio', verifyInicioRouter);
app.use('/api/verify-email', verifyEmailRouter);
app.use('/api', userRoutes); // Rutas de usuario

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de la API'); // Respuesta simple
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal!' });
});

setupSocketServer(server);

  
module.exports = {  app, server};
