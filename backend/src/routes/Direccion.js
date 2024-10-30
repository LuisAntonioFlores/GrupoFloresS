const express = require('express');
const direccionController = require('../controllers/direccionController'); // Asegúrate de que la ruta sea correcta
const router = express.Router();

// Rutas
router.get('/hola', direccionController.prueba);
router.post('/guardar', direccionController.crearDireccion);
router.get('/:cliente_id', direccionController.obtenerDirecciones);
router.get('/direccion/:id', direccionController.obtenerDireccionPorId);
router.put('/direccion/:id', direccionController.actualizarDireccion);
router.delete('/direccion/:id', direccionController.eliminarDireccion);

module.exports = router;
