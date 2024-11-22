const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
require('dotenv').config();

// Configuración de NodeMailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia esto según tu proveedor de correo
  auth: {
    user: process.env.EMAIL_USER, // Usuario desde las variables de entorno
    pass: process.env.EMAIL_PASS, // Contraseña desde las variables de entorno
  },
});

// Objeto para almacenar códigos de verificación
const verificationCodes = {};

// Enviar el código de verificación
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  // Generar código de 6 dígitos
  const verificationCode = crypto.randomInt(100000, 999999);
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutos

  // Guardar el código en memoria con la fecha de expiración
  verificationCodes[email] = {
    code: verificationCode,
    expiresAt: expirationTime,
  };

  // Configuración del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Verificación GrupoFloresOnline',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center; padding-bottom: 20px;">
                <!-- Logo -->
                <img src="${process.env.FRONTEND_URL}uploads/grupoflores.jpg" alt="Logo" width="150" />
              </td>
            </tr>
            <tr>
              <td style="font-size: 18px; color: #333; padding-bottom: 20px;">
                <p>¡Hola!</p>
                <p>Gracias por registrarte en GrupoFloresOnline. Para completar tu proceso de registro, por favor ingresa el siguiente código de verificación:</p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center;">
                <p style="font-size: 24px; font-weight: bold; color: #3498db; padding: 10px 0;">${verificationCode}</p>
              </td>
            </tr>
            <tr>
              <td style="font-size: 14px; color: #666; padding-top: 20px;">
                <p>Este código es válido por 10 minutos. Si no solicitaste este código, por favor ignora este correo.</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado con éxito.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
};
// Verificar el código de verificación
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const verificationData = verificationCodes[email];

  console.log('Códigos almacenados:', verificationCodes);

  // Verificar si no existe un código almacenado para el correo
  if (!verificationData) {
    return res.status(400).json({ message: 'Código no encontrado.' });
  }

  // Verificar si el código ha expirado
  if (Date.now() > verificationData.expiresAt) {
    delete verificationCodes[email]; // Eliminar el código después de la expiración
    console.log('El código ha expirado.');
    return res.status(400).json({ message: 'El código ha expirado.' });
  }

  // Verificar el código
  if (verificationData.code === parseInt(code, 10)) {
    // Eliminar el código después de validarlo
    delete verificationCodes[email]; 
    
    console.log('Código verificado correctamente.');
    
    // Actualizar el estado del usuario a verificado
    try {
      const user = await User.findOneAndUpdate(
        { email }, // Buscar el usuario por correo
        { emailVerified: true }, // Actualizar el campo 'emailVerified' a true
        { new: true } // Devolver el documento actualizado
      );

      // Verifica si el usuario fue encontrado y actualizado
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado.' });
      }

      // Confirmar si la actualización fue exitosa
      console.log('Usuario verificado:', user);

      res.status(200).json({ message: 'Código verificado correctamente, usuario verificado.' });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ message: 'Error al actualizar el estado de verificación.' });
    }
  } else {
    console.log('Código inválido o incorrecto.');
    res.status(400).json({ message: 'Código inválido o expirado.' });
  }
};


module.exports = { sendVerificationCode, verifyCode };
