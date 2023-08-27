// // routes/verifyEmail.js
 const express = require('express');
 const UserModel = require('../models/User'); // Asegúrate de importar el modelo del usuario si aún no lo has hecho

const router = express.Router();

router.post('/', async (req, res) => {
    const {email} = req.body;
  
    console.log('Verificando correo electrónico:', email);
  
    try {
      const user = await UserModel.findOne( {email} );
      if (user) {
        console.log('Correo electrónico encontrado en la base de datos.');
        res.json({ exists: true });
      } else {
        console.log('Correo electrónico no encontrado en la base de datos.');
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error al verificar el correo electrónico:', error);
      res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    }
  });
   module.exports = router;
