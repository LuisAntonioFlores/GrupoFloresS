const mongoose = require('mongoose');

// Definimos el esquema para los datos de contacto
const contactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/ // Valida que el email tenga el formato correcto
  },
  telefono: {
    type: String,
    required: true,
    match: /^\d{10}$/ // Validación de teléfono con 10 dígitos
  },
  quejas: {
    type: String,
    default: '' // Puede ser opcional
  },
  estado: {
    type: String,
    enum: ['atendido', 'en_proceso', 'no_atendido'],  // Define los valores válidos para estado
    default: 'no_atendido'  // Valor por defecto si no se especifica
  },
  fecha: {
    type: Date,
    default: Date.now // Fecha de creación
  }
});

// Creamos el modelo con el esquema definido
const Contacto = mongoose.model('Contacto', contactoSchema);

module.exports = Contacto;
