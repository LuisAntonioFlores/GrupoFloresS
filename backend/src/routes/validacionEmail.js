const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../controllers/verificationController.js');

// Ruta para enviar el código de verificación al correo
router.post('/enviar-codigo', sendVerificationCode);

// Ruta para verificar el código recibido
router.post('/verificar-codigo', verifyCode);

module.exports = router;
