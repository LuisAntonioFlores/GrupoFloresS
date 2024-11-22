const express = require('express');
const router = express.Router();
const { 
  registerUser,
   loginUser,
    getTasks,
     getPrivateTasks,
     updateProfile,
     getProfile,
     getNombrePorId, } = require('../controllers/userController.js');
const verifyToken = require('../middlewares/auth');
const multer = require('../libs/multer');

// Ruta para registrar un nuevo usuario con imagen
// Rutas públicas
router.post('/ingresar', registerUser);  // Registro de nuevo usuario
router.post('/iniciar', loginUser);      // Iniciar sesión

// Rutas protegidas (requieren token)
router.post('/update-profile', multer.single('imagen'), verifyToken, updateProfile);  // Actualización de perfil
router.get('/tareas', verifyToken, getTasks);  // Obtener tareas
router.get('/privatetasks', verifyToken, getPrivateTasks);  // Obtener tareas privadas
router.get('/perfil', verifyToken, getProfile);

// Ruta de pruebas (para verificar la API)
router.get('/pruebas', (req, res) => {
  res.status(200).json({ message: "Hola, soy usuario de pruebas" });
});



router.get('/usuario/:id',getNombrePorId);
module.exports = router;
