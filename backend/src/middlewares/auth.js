const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Verificar si la cabecera de autorización está presente
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.split(' ')[1] === 'null') {
    return res.status(401).send('Requiere autorización');
  }

  try {
    // Obtener el token desde la cabecera Authorization
    const token = authHeader.split(' ')[1];

    // Verificar el token y decodificar el payload
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'llaveSecreta');

    // Añadir el payload al objeto req para que esté disponible en las rutas
    req.user = payload;

    // Imprimir en la consola los datos recabados del token (esto es solo para depuración)
    console.log('Datos recabados del token:', req.user);

    // Verificar si el token ha expirado
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowInSeconds) {
      // Token expirado, rechazar acceso
      return res.status(401).send('Token expirado. Cierre de sesión requerido.');
    }

    // Continuar con la ejecución de la siguiente función (ruta)
    next();

  } catch (error) {
    console.error('Error al verificar el token de autorización:', error);
    return res.status(401).send('Token inválido');
  }
}

module.exports = verifyToken;
