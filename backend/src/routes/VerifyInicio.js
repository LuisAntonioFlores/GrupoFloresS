const express = require('express');
const bcrypt = require('bcrypt'); // Importa la librería bcrypt
const UserModel = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
   const { email, password } = req.body;

   console.log('Verificando inicio de sesión:', email);

   try {
     const user = await UserModel.findOne({ email });
     if (user) {
       // Compara la contraseña ingresada con la contraseña encriptada en la base de datos
       const passwordMatch = await bcrypt.compare(password, user.password);
       if (passwordMatch) {
         console.log('Inicio de sesión exitoso.');
         res.json({ success: true });
       } else {
         console.log('Contraseña incorrecta.');
         res.status(401).json({ error: 'Contraseña incorrecta' });
       }
     } else {
       console.log('Usuario no encontrado.');
       res.status(404).json({ error: 'Usuario no encontrado' });
     }
   } catch (error) {
     console.error('Error al verificar el inicio de sesión:', error);
     res.status(500).json({ error: 'Error al verificar el inicio de sesión' });
   }
});

module.exports = router;
