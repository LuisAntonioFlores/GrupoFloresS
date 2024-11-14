const webPush = require('web-push');

// Establecer claves VAPID
webPush.setVapidDetails(
  'mailto:luisflores1999@gmail.com',  // Tu correo de contacto
  'BP_mTpo6wbieGpTeonmfVziOjRpByqwDXT-Jk0OL3xa9UURP2XcN8GlSHA71ORn6IvKL0G6Bug6WqlGGo3NoE4I',             // Tu clave pública
  'guiDkBqBgMmpWtTWx0cXd5ZTd4wj0sDPD5FRTC8fjKE'              // Tu clave privada
);

// Controlador para manejar la suscripción de los usuarios
exports.subscribeUser = (req, res) => {
  const subscription = req.body;  // Suscripción enviada por el cliente

  // Aquí podrías guardar la suscripción en una base de datos si es necesario

  res.status(201).json({ message: 'Suscripción guardada con éxito' });
};

// Controlador para enviar una notificación push
exports.sendPushNotification = (req, res) => {
  const { subscription, payload } = req.body;  // La suscripción y los datos de la notificación

  // Enviar la notificación push
  webPush.sendNotification(subscription, payload)
    .then(response => {
      res.status(200).json({ message: 'Notificación enviada' });
    })
    .catch(error => {
      console.error('Error al enviar la notificación:', error);
      res.status(500).json({ error: 'Error al enviar la notificación' });
    });
};
