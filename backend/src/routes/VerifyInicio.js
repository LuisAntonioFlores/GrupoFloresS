const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log('Verificando inicio de sesión:', email);

  try {
    const user = await UserModel.findOne({ email });

    // Verificar si el usuario existe
    if (user) {
    //  console.log('Usuario encontrado:', user.email);

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
       // console.log('Inicio de sesión exitoso.');
        res.json({
          success: true,
        });
      } else {
        res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    } else {
     
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al verificar el inicio de sesión:', error);
    res.status(500).json({ error: 'Error al verificar el inicio de sesión' });
  }
});


module.exports = router;
