// routes/quejasrutas.js
const express = require('express');
const router = express.Router();
const { crearContacto, prueba , obtenerContactos, actualizarEstado} = require('../controllers/informes_quejas'); // Importar los controladores

// Ruta para crear un nuevo contacto (informe o queja)
router.post('/informe', crearContacto);

router.get('/informes', obtenerContactos);

router.patch('/informes/:id', actualizarEstado);

// Ruta de prueba
router.get('/prueba', prueba);

module.exports = router;
