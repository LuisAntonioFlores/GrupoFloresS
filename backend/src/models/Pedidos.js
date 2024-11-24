const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    numero_Pedido: { type: String, required: true, unique: true },
    cliente_id: { type: String, required: true },
    direccion_id: { type: String, required: true },
    items: [{
         product_id: String,
         title: String, 
         quantity: Number, 
         price: Number
         }],
    total_price: { type: Number, required: true },
    status: { type: String, default: 'pending' }, // Estado por defecto
    payment_id: { type: String }, // Para guardar el ID del pago
    comprobante_url: {
      type: String, // Almacenar la URL del comprobante de pago
      default: null
    },
    createdAt: { type: Date, default: Date.now },
    stockUpdated: { type: Boolean, default: false },
  estado_entrega: { type: String, enum: ['pendiente','En_proceso', 'llega_hoy', 'Entregado'], default: 'pendiente' } // Nuevo campo

});

const Pedido = mongoose.model('Pedido', PedidoSchema);
module.exports = Pedido;
