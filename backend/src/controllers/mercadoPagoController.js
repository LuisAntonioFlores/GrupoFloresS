const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_API_KEY });

// Set para rastrear pagos procesados
const processedPayments = new Set();

// Controlador para crear una preferencia de Mercado Pago
const createPreference = async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron productos en la solicitud." });
        }

        const items = products.map(product => ({
            title: product.title,
            quantity: Number(product.quantity),
            unit_price: Number(product.price),
            currency_id: "MXN"
        }));

        const preference = new Preference(client);
        const preferenceResult = await preference.create({
            body: {
                items,
                back_urls: {
                    success: "https://youtu.be/fJD3opkybpE",
                    failure: "https://youtu.be/5SiW4UWAf8g?list=RD5SiW4UWAf8g",
                    pending: "https://youtu.be/5SiW4UWAf8g?list=RD5SiW4UWAf8g"
                },
                auto_return: "approved",
                notification_url: "https://370b-201-141-19-135.ngrok-free.app/api/pago/webhook"
            }
        });

        res.json({ id: preferenceResult.id, init_point: preferenceResult.init_point });
    } catch (error) {
        console.log("Error en el manejo de la solicitud:", error);
        res.status(500).json({ error: "Error en el manejo de la solicitud." });
    }
};

// Controlador para manejar webhooks
const handleWebhook = (req, res) => {
    try {
        const data = req.body;
        console.log("Evento recibido desde Mercado Pago:", data);

        if (data.type === "payment") {
            const paymentInfo = data.data;

            // Verificar si el pago ya fue procesado
            if (processedPayments.has(paymentInfo.id)) {
                console.log(`El pago con ID ${paymentInfo.id} ya fue procesado.`);
                return res.status(200).send("Pago ya procesado");
            }

            console.log("Información del pago:", paymentInfo);

            switch (paymentInfo.status) {
                case 'approved':
                    console.log(`Pago aprobado: ${paymentInfo.id}`);
                    // Aquí puedes realizar la lógica para completar el pedido
                    break;
                case 'pending':
                    console.log(`Pago pendiente: ${paymentInfo.id}`);
                    // Aquí podrías notificar al usuario que el pago está en proceso
                    break;
                case 'rejected':
                    console.log(`Pago rechazado: ${paymentInfo.id}`);
                    // Aquí puedes manejar el rechazo
                    break;
                case 'cancelled':
                    console.log(`Pago cancelado: ${paymentInfo.id}`);
                    // Aquí podrías notificar al usuario que el pago fue cancelado
                    break;
                default:
                    console.log(`Estado del pago desconocido: ${paymentInfo.id}`);
            }

            // Marcar este pago como procesado
            processedPayments.add(paymentInfo.id);
        }

        if (data.topic === "merchant_order") {
            const merchantOrderId = data.resource.split("/").pop();
            console.log("Evento de orden de comerciante recibido:", merchantOrderId);
            // Lógica para manejar las órdenes del comerciante
        }

        res.status(200).send("Evento recibido"); 
    } catch (error) {
        console.error("Error en el webhook:", error);
        res.status(500).send("Error en el manejo del webhook");
    }
};

module.exports = {
    createPreference,
    handleWebhook
};
