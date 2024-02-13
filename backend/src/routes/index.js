const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/ingresar', async (req, res) => {
  try {
    const { nombre, apellidoP, apellidoM, email, password, fechaNacimiento, sexo, tipoUsuario } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario en la base de datos
    const newUser = new UserModel({ nombre, apellidoP, apellidoM, email, password: hashedPassword, fechaNacimiento, sexo, tipoUsuario });
    await newUser.save();

    // Generar un token JWT con la información del usuario
    const tokenPayload = {
      _id: newUser._id,
      nombre: newUser.nombre,
      apellidoPaterno: newUser.apellidoP,
      apellidoMaterno: newUser.apellidoM,
      tipoUsuario: newUser.tipoUsuario,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'llaveSecreta', { expiresIn: '20m' });

    // Enviar el token y los detalles del usuario como respuesta
    return res.status(200).json({
      token,
      nombre: newUser.nombre,
      apellidoPaterno: newUser.apellidoP,
      apellidoMaterno: newUser.apellidoM,
      tipoUsuario: newUser.tipoUsuario,
      _id: user._id

    });
  } catch (error) {
    console.error('Error al registrar un nuevo usuario:', error);
    return res.status(500).send('Error interno del servidor');
  }
});

// Ruta para iniciar sesión
router.post('/iniciar', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).send("El Correo no existe");

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).send('Contraseña incorrecta');

    // Generar un token JWT con nombre, apellidos y tipo de usuario incluidos
    const tokenPayload = {
      _id: user._id,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoP,
      apellidoMaterno: user.apellidoM,
      tipoUsuario: user.tipoUsuario,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'llaveSecreta', { expiresIn: '20m' });

    // Enviar el token y los detalles del usuario como respuesta
    return res.status(200).json({
      token,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoP,
      apellidoMaterno: user.apellidoM,
      tipoUsuario: user.tipoUsuario,
      _id: user._id
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).send('Error interno del servidor');
  }
});

// Rutas protegidas
router.get('/tareas', verifyToken, (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, tipoUsuario } = req.user;

  res.json({
    tasks: [
      // ... tus datos de tareas
    ],
  });
});

router.get('/privatetasks', verifyToken, (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, tipoUsuario } = req.user;
  res.json({
    tasks: [
      // ... tus datos de tareas privadas
    ],
  });
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
  if (!req.headers.authorization || req.headers.authorization.split(' ')[1] === 'null') {
    return res.status(401).send('Requiere autorización');
  }

  try {
    // Verificar el token y decodificar el payload
    const payload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET || 'llaveSecreta');

    // Añadir el payload a req.user para acceder a los datos en las rutas protegidas
    req.user = payload;

    // Imprimir en la consola los datos recabados
    console.log('Datos recabados del token:', req.user);

    // Verificar si el token ha expirado
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowInSeconds) {
      // Token expirado, cerrar sesión
      return res.status(401).send('Token expirado. Cierre de sesión requerido.');
    }

    // Continuar con la ejecución de la siguiente función
    next();

  } catch (error) {
    console.error('Error al verificar el token de autorización:', error);
    return res.status(401).send('Token inválido');
  }
}

// Manejo de rutas no encontradas
router.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

module.exports = router;
