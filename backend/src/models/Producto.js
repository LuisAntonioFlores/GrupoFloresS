    const mongoose = require("mongoose");
    const { Schema, model } = mongoose;

    const schema = new Schema({
        title: String,
        description: String,
        imagePath: String,
        price: Number,       // Agregado: Precio
        quantity: Number, 
        enOferta: { type: Boolean, default: false },   // Agregado: Cantidad
        date: { type: Date, default: Date.now }   // Agregado: Fecha (con valor predeterminado actual)
    });

    const Producto = model('Producto', schema);
    module.exports = Producto;
