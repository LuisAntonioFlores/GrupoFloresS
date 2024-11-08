const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  pais: {
    type: String,
    required: true,
    default: 'México',
  },
  nombreUsuario: {
    type: String,
    required: true,
  },
  codigoPostal: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  municipio: {
    type: String,
    required: true,
  },
  
  colonia: {
    type: String,
    required: true,
  },
  calle: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  numeroInterior: {
    type: String,
    default: 'SN',
  },
  calle1: {
    type: String,
  },
  calle2: {
    type: String,
  },
  tipo: {
    type: String,
    enum: ['work', 'home'], // Puedes agregar 'home' si es necesario
    required: true,
  },
  numeroContacto: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+52\d{10}$/.test(v); // Verifica que el número tenga el formato +52 seguido de 10 dígitos
      },
      message: props => `${props.value} no es un número de contacto válido (debe comenzar con +52 y tener 10 dígitos).`,
    },
  },
  descripcion: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Direccion', direccionSchema);
