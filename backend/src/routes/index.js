const { Router } = require('express');
const express = require('express');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Agrega esta líne

const router = Router();

router.get('/', (req, res) => res.send('hello world'));

router.post('/ingresar', async (req, res) => {
  const { nombre, apellidoP, apellidoM, email, password, fechaNacimiento, sexo, tipoUsuario } = req.body;
  
  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ nombre, apellidoP, apellidoM, email, password: hashedPassword, fechaNacimiento, sexo, tipoUsuario });
  await newUser.save();

  const token = jwt.sign({ _id: newUser._id }, 'llaveSecreta');
  res.status(200).json({ token });
});
router.post('/iniciar', async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  
  if (!user) return res.status(401).send("El Correo no existe");
  
  // Comparar la contraseña ingresada con la almacenada en la base de datos
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) return res.status(401).send('contraseña incorrecta');

  const token = jwt.sign({ _id: user._id }, 'llaveSecreta');
  return res.status(200).json({ token });
});

// ... Resto de tus rutas ...


router.get('/tareas', (req, res) => {
  res.json([
    {
      _id: 1,
      name: 'Pregunta uno',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    },
    {
      _id: 2,
      name: 'Pregunta dos',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    },
    {
      _id: 3,
      name: 'Pregunta tres',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    }
  ]);
});

router.get('/privatetasks', verifyToken, (req, res) => {
  res.json([
    {
      _id: 1,
      name: 'Pregunta uno',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    },
    {
      _id: 2,
      name: 'Pregunta dos',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    },
    {
      _id: 3,
      name: 'Pregunta tres',
      description: 'lorem ipsum',
      date: "2023-08-02T06:20:08.696Z"
    }
  ]);
});

module.exports = router;

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Requiere autorizacion');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Requiere autorizacion');
  }
  try {
    const payload = jwt.verify(token, 'llaveSecreta');
    req.userId = payload._id;
    next();
  } catch (error) {
    console.error('Error al verificar el token de autorización:', error);
    return res.status(401).send('Token inválido');
  }
}
