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
  const { page = 1, limit = 10, status } = req.query; // Paginación y filtros
  const query = status ? { status } : {};  // Si se proporciona un estado, filtra por él
  
  console.log(`Paginación: página ${page}, límite ${limit}`);
  if (status) {
    console.log(`Filtrando por estado: ${status}`);
  } else {
    console.log('Sin filtro de estado.');
  }

  try {
    // Obtener los pedidos con paginación y filtro
    const orders = await Order.find(query)
      .populate('cliente_id', 'name') // Solo el nombre del cliente
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    console.log(`Pedidos obtenidos: ${orders.length}`);

    const total = await Order.countDocuments(query); // Cuenta los pedidos que coinciden con el filtro
    console.log(`Total de pedidos: ${total}`);
    
    // Enviar respuesta con los datos
    res.status(200).json({
      success: true,
      data: orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit) // Calcula las páginas totales
    });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error.message);
    res.status(500).json({ success: false, message: 'Error al obtener los pedidos', error: error.message });
  }
};


// Controlador para obtener un pedido por su ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('cliente_id', 'name'); // Populate para obtener el nombre del cliente
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
  const allowedUpdates = ['estado_entrega']; // Los campos que se pueden actualizar
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ success: false, message: 'Actualización no permitida en estos campos' });
  }

  try {
    // Buscar el pedido por numero_Pedido en lugar de _id
    const order = await Order.findOneAndUpdate(  // Usamos `findOneAndUpdate` para buscar por numero_Pedido
      { _id: req.params.id },  // Aquí buscamos con numero_Pedido
      req.body,
      { new: true } // Devuelve el pedido actualizado
    );

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
