const { Router } = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/Pedidos.controllers");

const router = Router();

router.route('/Pedido')
  .post((req, res) => createOrder(req, res))
  .get((req, res) => getAllOrders(req, res));

router.route('/Pedido/:id')
  .get((req, res) => getOrderById(req, res))
  .put((req, res) => updateOrderById(req, res))
  .delete((req, res) => deleteOrderById(req, res));

module.exports = router;
