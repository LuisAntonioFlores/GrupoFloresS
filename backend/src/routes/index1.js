// Importa las funciones y módulos necesarios
const { Router } = require("express");
const multer = require("../libs/multer");
const {
  createProducto,
  getProductos,
  getProducto,
  deleteProducto,
  updateProducto,
} = require("../controllers/Producto.controllers");

// Crea un router
const router = Router();

// Define las rutas
router.route('/Producto')
  .post(multer.single('image'), (req, res) => createProducto(req, res))
  .get((req, res) => getProductos(req, res)); // Asegúrate de que getPhotos esté definida

router.route('/Producto/:id')
  .get((req, res) => getProducto(req, res)) // Asegúrate de que getPhoto esté definida
  .delete((req, res) => deleteProducto(req, res)) // Asegúrate de que deletePhoto esté definida
  .put((req, res) => updateProducto(req, res)); // Asegúrate de que updatePhoto esté definida

// Exporta el router
module.exports = router;
