const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Usuario = require('../models/User');
const ResetToken = require('../models/ResetToken');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expirationTime = Date.now() + 15 * 60 * 1000;

    await ResetToken.create({
      email,
      token,
      expiresAt: new Date(expirationTime),
    });

    const resetLink = `${process.env.FRONTEND_URL}/cambiar-contrasena?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecimiento de Contraseña. "Grupo Flores"',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="text-align: center; padding-bottom: 20px;">
                  <img src="${process.env.FRONTEND_URL}uploads/grupoflores.jpg" alt="Logo" width="150" />
   
                </td>
              </tr>
              <tr>
                <td style="font-size: 18px; color: #333; padding-bottom: 20px;">
                  <p>¡Hola!</p>
                  <p>Hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente botón para restablecerla:</p>
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <a href="${resetLink}" style="display: inline-block; background-color: #3498db; color: #fff; padding: 14px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;">
                    Restablecer mi Contraseña
                  </a>
                </td>
              </tr>
              <tr>
                <td style="font-size: 14px; color: #666; padding-top: 20px;">
                  <p>Este enlace expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };


    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Enlace de recuperación enviado con éxito.' });
  } catch (error) {
    console.error('Error al enviar el enlace:', error);
    res.status(500).json({ message: 'Error al enviar el enlace de recuperación.' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const resetToken = await ResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    if (Date.now() > resetToken.expiresAt.getTime()) {
      await ResetToken.deleteOne({ token });
      return res.status(400).json({ message: 'El token ha expirado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await Usuario.findOneAndUpdate(
      { email: resetToken.email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await ResetToken.deleteOne({ token });

    res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};

module.exports = { sendResetLink, resetPassword };
