const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

// Ruta POST para crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET para ver la lista de productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
