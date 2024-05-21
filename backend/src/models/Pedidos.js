const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    numero_Pedido: {
        type: String,
        required: true
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
        enum: ['Pending', 'Shipped', 'Delivered'],
        default: 'Pending'
    },
    items: [
        {
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
        }
    ],
    total_price: {
        type: Number,
        required: true
    }
});

const Pedido = mongoose.model('Pedidos', Schema);
module.exports = Pedido;
