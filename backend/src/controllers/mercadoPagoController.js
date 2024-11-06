const mongoose = require('mongoose'); // Importar mongoose
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { getSocketInstance } = require('../controllers/socket');
require('dotenv').config();

const Pedido = require('../models/Pedidos');
const Producto = require('../models/Producto');
// Set para rastrear pagos procesados

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_API_KEY });
const paymentStatus = {};
// Controlador para crear una preferencia de Mercado Pago
const createPreference = async (req, res) => {
    try {
        const { products, cliente_id, direccion_id } = req.body;
        // console.log('Datos de la preferencia:', { products, cliente_id, direccion_id });
        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron productos en la solicitud." });
        }

        // Validación de cliente_id y direccion_id
        if (!cliente_id) {
            return res.status(400).json({ error: "El cliente_id es requerido." });
        }

        if (!direccion_id) {
            return res.status(400).json({ error: "El direccion_id es requerido." });
        }


        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron productos en la solicitud." });
        }
        //  console.log('Productos recibidos:', products); // Log de productos recibidos
        // Verificar productos duplicados
        const productTitles = products.map(product => product.title);
        const uniqueTitles = new Set(productTitles);


        if (uniqueTitles.size !== productTitles.length) {
            return res.status(400).json({ error: "Algunos productos son duplicados." });
        }

        const items = products.map(product => ({
            id: product.product_id,
            title: product.title,
            quantity: Number(product.quantity),
            unit_price: Number(product.price),
            currency_id: "MXN"
        }));

        //console.log('Items preparados para la preferencia:', items);

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
                notification_url: "https://deb0-201-141-22-5.ngrok-free.app/api/pago/webhook",
                external_reference: cliente_id,
                metadata: {
                    direccion_id: direccion_id // Agrega el ID de la dirección en metadata
                }
            }
        });


        res.json({ id: preferenceResult.id, init_point: preferenceResult.init_point });
    } catch (error) {
        console.log("Error en el manejo de la solicitud:", error);
        res.status(500).json({ error: "Error en el manejo de la solicitud." });
    }
};
const processedPayments = new Set()
const handleWebhook = async (req, res) => {


    const id = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if (!id || !topic) {
        console.error('ID o Topic no están definidos.');
        return res.status(400).send('ID o Topic no definidos');
    }

    // Responder inmediatamente a Mercado Pago
    res.status(200).send('Webhook recibido correctamente');

    // Verificar si el pago ya está en proceso
    if (processedPayments.has(id)) {
        console.log(`Pago ya procesado o en proceso: ${id}`);
        return;
    }

    // Marcar el pago como "en proceso"
    processedPayments.add(id);

    try {
        if (topic === 'payment') {
            const paymentInfo = await fetchPaymentInfo(id);
            const { status, external_reference: cliente_id, metadata } = paymentInfo;
            const numeroPedido = paymentInfo.order?.id;

            if (!numeroPedido) {
                console.error('Número de pedido no encontrado en la información de pago.');
                return;
            }

            // Actualizar el estado de pago en el pedido sin tocar el stock
            let pedido = await Pedido.findOne({ numero_Pedido: numeroPedido });

            if (!pedido) {
                pedido = new Pedido({
                    numero_Pedido: numeroPedido,
                    cliente_id,
                    direccion_id: metadata?.direccion_id || null,
                    items: paymentInfo.additional_info?.items.map(item => ({
                        product_id: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        price: item.unit_price
                    })),
                    total_price: paymentInfo.transaction_amount,
                    status,
                    payment_id: id,
                    stockUpdated: false
                });
                await pedido.save();
            } else {
                pedido.status = status;
                await pedido.save();
            }
            if (status === 'approved') {
                if (!cliente_id) {
                    console.error('cliente_id no está presente en la información del pago.');
                    return; // Termina la ejecución si cliente_id no está disponible
                }
            
                console.log(`Pago aprobado para el cliente con ID: ${cliente_id}`);
            
                paymentStatus[cliente_id] = {
                    status: 'approved',
                    action: 'clear_cart',
                    timestamp: new Date().toISOString()
                };
            }
            

        }

        // Solo procesar el ajuste de stock en 'merchant_order' cuando el pago esté aprobado
        else if (topic === 'merchant_order') {
            const orderInfo = await fetchOrderInfo(id);
            const orderId = orderInfo.id;
            const isPaymentApproved = orderInfo.payments.some(p => p.status === 'approved');

            // Si el pedido ya está procesado o el stock está actualizado, evitar procesamiento duplicado
            let pedido = await Pedido.findOne({ numero_Pedido: orderId });
            if (pedido?.stockUpdated || !isPaymentApproved) {
                console.log(`Pedido ya procesado o pago no aprobado: ${orderId}`);
                return;
            }



            // Actualizar el stock solo si el pago está aprobado
            pedido.processing = true;  // Bloqueo temporal para evitar conflictos en el procesamiento
            for (const item of pedido.items) {
                await updateProductQuantity(item.product_id, item.quantity);
            }
            pedido.status = 'paid';
            pedido.stockUpdated = true;
            pedido.processing = false;
            console.log(`Stock actualizado y estado de pedido marcado como 'paid': ${orderId}`);
            await pedido.save();
        }
    } catch (error) {
        console.error('Error al procesar el webhook:', error);
    } finally {
        processedPayments.delete(id);
    }
};






const updateProductQuantity = async (id, quantitySold) => {
    if (!id) {
        console.warn('ID de producto es nulo o indefinido.');
        return;
    }

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            console.error('Producto no encontrado:', id);
            return;
        }

        if (producto.quantity < quantitySold) {
            console.error('No hay suficiente cantidad en stock:', id);
            return;
        }

        producto.quantity -= quantitySold;
        await producto.save();
        console.log(`Cantidad de producto actualizada: ${id}, nueva cantidad: ${producto.quantity}`);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
    }
};






const fetchPaymentInfo = async (paymentId) => {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.MERCADO_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Error al obtener la información del pago:', errorBody);
        throw new Error(`Error al obtener la información del pago: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};





const actualizarEstado = async (orderId, paymentId) => {
    try {
        console.log(`Buscando el pedido con ID: ${orderId}`);
        const pedido = await Pedido.findOne({ numero_Pedido: orderId });
        if (!pedido) {
            console.error('Pedido no encontrado');
            return;
        }

        console.log(`Estado actual del pedido: ${pedido.status}`);
        if (pedido.status === 'paid') {
            console.log('Este pedido ya ha sido pagado.');
            return;
        }

        // Actualizar el estado del pedido a 'paid' y asociar el ID del pago
        pedido.status = 'paid';
        pedido.payment_id = paymentId; // Guarda el ID del pago para futuras referencias
        await pedido.save();

        console.log('Estado de la orden actualizado exitosamente a "paid".');
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        throw error; // Lanza el error para manejarlo más tarde
    }
};


const fetchOrderInfo = async (orderId) => {
    const response = await fetch(`https://api.mercadopago.com/merchant_orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.MERCADO_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Error al obtener la información de la orden:', errorBody);
        throw new Error(`Error al obtener la información de la orden: ${response.status} ${response.statusText}`);
    }

    return await response.json();
};

const mostrarPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find(); // Recupera todos los pedidos
        console.log('Pedidos en la base de datos:', pedidos); // Muestra los pedidos en la consola
        res.status(200).json(pedidos); // Responde con la lista de pedidos
    } catch (error) {
        console.error('Error al recuperar los pedidos:', error);
        res.status(500).json({ error: 'Error al recuperar los pedidos.' });
    }
};
const obtenerEstadoPago = (req, res) => {
    const { clienteId } = req.params;
    console.log('Recibiendo clienteId:', clienteId);

    if (paymentStatus[clienteId]) {

        console.log('Estado de pago para el cliente con ID ' + clienteId + ':', paymentStatus[clienteId]);
        res.status(200).json(paymentStatus[clienteId]); // Envía el estado de pago al frontend
    } else {
        console.log('Estado de pago no encontrado para el cliente con ID ' + clienteId);
        res.status(404).json({ error: 'Estado de pago no encontrado para este cliente.' });
    }
};



module.exports = {
    createPreference,
    handleWebhook,
    obtenerEstadoPago,
    mostrarPedidos

};
