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
    createdAt: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);
module.exports = Pedido;
