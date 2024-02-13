const Order = require('../models/Pedidos');
const { validationResult } = require('express-validator');

// Controlador para crear un nuevo pedido
exports.createOrder = async (req, res) => {
  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Error de validación', errors: errors.array() });
  }

  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true, message: 'Pedido creado correctamente', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear el pedido', error: error.message });
  }
};

// Controlador para obtener todos los pedidos
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('cliente_id', 'name'); // Populate para obtener solo el nombre del cliente
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener los pedidos', error: error.message });
  }
};

// Controlador para obtener un pedido por su ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cliente_id', 'name'); // Populate para obtener solo el nombre del cliente
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener el pedido', error: error.message });
  }
};

// Controlador para actualizar un pedido por su ID
exports.updateOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Pedido actualizado correctamente', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar el pedido', error: error.message });
  }
};

// Controlador para eliminar un pedido por su ID
exports.deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Pedido eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar el pedido', error: error.message });
  }
};
