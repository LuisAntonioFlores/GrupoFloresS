const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Ruta para suscribir al usuario
router.post('/subscribe', notificationController.subscribeUser);

// Ruta para enviar una notificación push
router.post('/send-notification', notificationController.sendPushNotification);

module.exports = router;
