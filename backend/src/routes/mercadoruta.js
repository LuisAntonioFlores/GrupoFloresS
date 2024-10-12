const express = require('express');
const { createPreference, handleWebhook } = require('../controllers/mercadoPagoController.js'); // Ajusta la ruta según tu estructura de carpetas

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Soy el servidor MERCADO PAGO :)");
});

// Ruta para crear la preferencia
router.post("/create_preference", createPreference);

// router.post("/webhook", handleWebhook);
router.post("/webhook", (req, res) => {
    try {
        handleWebhook(req, res);
    } catch (error) {
        console.error("Error en el webhook:", error);
        res.status(500).send("Error en el manejo del webhook");
    }
});
router.get('/success', (req, res) => {
    // Aquí podrías manejar la lógica de éxito
    const { collection_id, payment_id, status } = req.query;
    res.send(`Pago exitoso! ID de colección: ${collection_id}, ID de pago: ${payment_id}, Estado: ${status}`);
});

module.exports = router;
