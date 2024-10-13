const mongoose = require('mongoose'); // Importar mongoose
const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_API_KEY });
const Pedido = require('../models/Pedidos');

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
                notification_url: "https://d70e-201-141-106-179.ngrok-free.app/api/pago/webhook"
            }
        });

        res.json({ id: preferenceResult.id, init_point: preferenceResult.init_point });
    } catch (error) {
        console.log("Error en el manejo de la solicitud:", error);
        res.status(500).json({ error: "Error en el manejo de la solicitud." });
    }
};

const fetchPaymentInfo = async (paymentId) => {
    // Obtener información del pago desde Mercado Pago
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.MERCADO_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorBody = await response.text(); // Obtener el cuerpo de la respuesta
        console.error('Error al obtener la información de la orden:', errorBody);
        throw new Error(`Error al obtener la información de la orden: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

const handleWebhook = async (req, res) => {
    const { id, topic } = req.query;

    if (!id || !topic) {
        console.error('ID o Topic no están definidos.');
        return res.status(400).send('ID o Topic no definidos');
    }

    console.log(`Recibido webhook - ID: ${id}, Topic: ${topic}`);

    try {
        if (topic === 'payment') {
            const paymentInfo = await fetchPaymentInfo(id);
            console.log('Información del pago:', paymentInfo);

            if (paymentInfo.status === 'approved') {
                let items = [];

                // Verificar si hay items en la información del pago
                if (Array.isArray(paymentInfo.items) && paymentInfo.items.length > 0) {
                    items = paymentInfo.items.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        price: item.unit_price
                    }));
                } else {
                    // Si no hay items, buscar detalles de la orden
                    if (paymentInfo.order && paymentInfo.order.id) {
                        const orderId = paymentInfo.order.id;
                        const orderInfo = await fetchOrderInfo(orderId); // Función para obtener detalles de la orden
                        items = orderInfo.items.map(item => ({
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price
                        }));
                    } else {
                        console.error('No se encontraron items en el pago y tampoco se pudo obtener información de la orden.');
                        return res.status(400).send('No se encontraron items en el pago.');
                    }
                }

                const newPedido = new Pedido({
                    numero_Pedido: paymentInfo.id,
                    cliente_id: 'CLIENTE_ID_AQUI',
                    status: 'Paid',
                    paymentStatus: 'Approved',
                    paymentMethod: paymentInfo.payment_type,
                    mercadoPagoPaymentId: paymentInfo.id,
                    mercadoPagoOrderId: paymentInfo.order.id,
                    items,
                    total_price: paymentInfo.transaction_amount,
                    shippingAddress: {
                        street: 'DIRECCION_AQUI',
                        city: 'CIUDAD_AQUI',
                        postalCode: 'CODIGO_POSTAL_AQUI',
                        country: 'PAIS_AQUI'
                    },
                    paymentDetails: {
                        transaction_amount: paymentInfo.transaction_amount,
                        net_received_amount: paymentInfo.net_received_amount,
                        total_paid_amount: paymentInfo.total_paid_amount,
                        mercadoPagoFee: paymentInfo.fee_details[0]?.amount // Asegúrate de manejar esto adecuadamente
                    },
                    date_approved: new Date()
                });

                await newPedido.save();
                console.log('Pedido guardado exitosamente:', newPedido);
            } else {
                console.log('Pago no aprobado. Estado:', paymentInfo.status);
            }
        } else if (topic === 'merchant_order') {
            console.log('Notificación de orden recibida:', id);
            // Procesar la notificación de la orden
            const orderInfo = await fetchOrderInfo(id);
            console.log('Información de la orden:', orderInfo);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error al procesar el webhook:', error.message);
        return res.status(500).send('Error interno del servidor');
    }
};


const actualizarEstado = async (objectId) => {
    try {
        // Lógica para actualizar el estado del pedido en la base de datos
        await Pedido.updateOne({ _id: objectId }, { status: 'actualizado' }); // Cambia esto según tu lógica
        console.log('Estado de la orden actualizado exitosamente.');
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        throw error; // Lanza el error para manejarlo más tarde
    }
};

const fetchOrderInfo = async (orderId) => {
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADO_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json(); // Obtener el cuerpo de la respuesta
            console.error('Error al obtener la información de la orden:', errorBody);
            throw new Error(`Error al obtener la información de la orden: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error en fetchOrderInfo:', error.message);
        throw error; // Lanzar de nuevo el error para manejarlo en el controlador
    }
};


module.exports = {
    createPreference,
    handleWebhook
};
