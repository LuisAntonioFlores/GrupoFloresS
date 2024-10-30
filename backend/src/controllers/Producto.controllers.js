const Producto = require('../models/Producto');
const fs = require('fs').promises;
const path = require('path');

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    
    return res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID del producto recibido:', id);
    const producto = await Producto.findById(id);
    return res.json(producto);
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createProducto = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path;
    }

    const newProducto = {
      title,
      description,
      imagePath,
      price,
      quantity,
      date: Date.now()
    };

    const producto = new Producto(newProducto);
    await producto.save();

    return res.json({
      message: 'Producto creado correctamente',
      producto
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByIdAndRemove(id);

    if (producto && producto.imagePath) {
      await fs.unlink(path.resolve(producto.imagePath.toString()));
    }

    return res.json({
      message: 'Producto eliminado correctamente',
      producto
    });
  } catch (error) {
    console.error('Error al eliminar el producto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity } = req.body;
    const updatedProducto = await Producto.findByIdAndUpdate(id, {
      title,
      description,
      price,
      quantity
    }, { new: true });

    return res.json({
      message: 'Producto actualizado correctamente',
      updatedProducto
    });
  } catch (error) {
    console.error('Error al actualizar el producto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getProductos,
  getProducto,
  createProducto,
  deleteProducto,
  updateProducto
  // Otras funciones del controlador si las hay
};
