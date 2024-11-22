const { Schema, model } = require('mongoose');

const resetTokenSchema = new Schema({
  email: { type: String, required: true }, // Correo asociado al token
  token: { type: String, required: true }, // Token único
  expiresAt: { type: Date, required: true, index: { expires: '0' } },
});

// Índice para eliminar automáticamente documentos después de la expiración
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model('ResetToken', resetTokenSchema);
