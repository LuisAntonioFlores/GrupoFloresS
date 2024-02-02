// Importa las funciones y módulos necesarios
const { Router } = require("express");
const multer = require("../libs/multer");
const {
  createPhoto,
  getPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto,
} = require("../controllers/photo.controllers");

// Crea un router
const router = Router();

// Define las rutas
router.route('/photos')
  .post(multer.single('image'), (req, res) => createPhoto(req, res))
  .get((req, res) => getPhotos(req, res)); // Asegúrate de que getPhotos esté definida

router.route('/photos/:id')
  .get((req, res) => getPhoto(req, res)) // Asegúrate de que getPhoto esté definida
  .delete((req, res) => deletePhoto(req, res)) // Asegúrate de que deletePhoto esté definida
  .put((req, res) => updatePhoto(req, res)); // Asegúrate de que updatePhoto esté definida

// Exporta el router
module.exports = router;
