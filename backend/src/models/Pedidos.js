const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const pedidoSchema = new mongoose.Schema({
    numero_Pedido: {
        type: String,
        required: true,
        unique: true,
        index: true // Agregado para mejorar la búsqueda
    },
    cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    date_Pedido: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'In Process', 'Refunded'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'account_money', 'other'],
        required: true
    },
    mercadoPagoPaymentId: {
        type: String,
        required: false // Guardar el ID del pago generado por Mercado Pago
    },
    mercadoPagoOrderId: {
        type: String,
        required: false // Guardar el ID de la orden generado por Mercado Pago
    },
    items: [itemSchema], // Definido como un subdocumento separado para mayor claridad
    total_price: {
        type: Number,
        required: true,
        min: 0 // Asegurar que el precio total no sea negativo
    },
    shippingAddress: {
        street: { type: String, required: true }, // Cambiado a requerido
        city: { type: String, required: true },   // Cambiado a requerido
        postalCode: { type: String, required: true }, // Cambiado a requerido
        country: { type: String, required: true }  // Cambiado a requerido
    },
    paymentDetails: {
        transaction_amount: { type: Number },
        net_received_amount: { type: Number },
        total_paid_amount: { type: Number },
        mercadoPagoFee: { type: Number }
    },
    date_approved: {
        type: Date,
        required: false
    }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
