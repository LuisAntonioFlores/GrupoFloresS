const mongoose = require('mongoose'); // Importar mongoose
const { MercadoPagoConfig, Preference } = require('mercadopago');

require('dotenv').config();

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_API_KEY });
const Pedido = require('../models/Pedidos');
const Producto = require('../models/Producto');
// Set para rastrear pagos procesados
const processedPayments = new Set();

// Controlador para crear una preferencia de Mercado Pago
const createPreference = async (req, res) => {
    try {
        const { products, cliente_id,direccion_id } = req.body;
        console.log('Datos de la preferencia:', { products, cliente_id, direccion_id });


        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron productos en la solicitud." });
        }
        console.log('Productos recibidos:', products); // Log de productos recibidos
        // Verificar productos duplicados
        const productTitles = products.map(product => product.title);
        const uniqueTitles = new Set(productTitles);

        if (!products || products.length === 0) {
            console.log('Solicitud recibida sin productos:', req.body); // Log adicional
            return res.status(400).json({ error: "No se proporcionaron productos en la solicitud." });
        }
            // Validación de cliente_id y direccion_id
    if (!cliente_id) {
        return res.status(400).json({ error: "El cliente_id es requerido." });
    }
    
    if (!direccion_id) {
        return res.status(400).json({ error: "El direccion_id es requerido." });
    }

        if (uniqueTitles.size !== productTitles.length) {
            return res.status(400).json({ error: "Algunos productos son duplicados." });
        }

        // Verificar que todos los productos tengan un ID válido
        // const invalidProducts = products.filter(product => !product._id);
        // if (invalidProducts.length > 0) {
        //     return res.status(400).json({ error: "Algunos productos no tienen un ID válido.", invalidProducts });
        // }

        const items = products.map(product => ({
         id: product.product_id,
            title: product.title,
            quantity: Number(product.quantity),
            unit_price: Number(product.price),
            currency_id: "MXN"
        }));
        console.log('Items preparados para la preferencia:', items);

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
                notification_url: "https://332c-201-141-104-22.ngrok-free.app/api/pago/webhook",
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


const handleWebhook = async (req, res) => {
    const id = req.query.id || req.query['data.id'];
    const topic = req.query.topic || req.query.type;

    if (!id || !topic) {
        console.error('ID o Topic no están definidos.');
        return res.status(400).send('ID o Topic no definidos');
    }

    console.log(`Recibido webhook - ID: ${id}, Topic: ${topic}`);

    try {
        if (topic === 'payment') {
            // Obtener información del pago
            const paymentInfo = await fetchPaymentInfo(id);
            console.log('Información del pago:', paymentInfo);

            const { transaction_amount, order, status } = paymentInfo;
            const numeroPedido = order.id;

            // Verificar si el pedido ya existe
            const pedidoExistente = await Pedido.findOne({ numero_Pedido: numeroPedido, payment_id: paymentInfo.id });

            if (pedidoExistente) {
                console.log(`El pedido ya existe (ID: ${numeroPedido}, Payment ID: ${paymentInfo.id}), no se guardará nuevamente.`);
                return res.sendStatus(200); // Ya existe, no hacer nada más
            }

            // Obtener external_reference que contiene el cliente_id
            const cliente_id = paymentInfo.external_reference;
            const direccion_id = paymentInfo.metadata.direccion_id;

            // Obtener los items
            let items = paymentInfo.additional_info.items || [];

            if (items.some(item => !item.id)) {
                console.error('Algunos items no tienen un ID válido:', items);
                return res.status(400).json({ error: "Algunos items no tienen un ID válido." });
            }
            if (items.length === 0) {
                const orderInfo = await fetchOrderInfo(order.id);
                items = orderInfo.items;
            }

            // Crear el nuevo pedido con la información del pago y el cliente_id
            const nuevoPedido = new Pedido({
                numero_Pedido: numeroPedido,
                cliente_id: cliente_id,
                direccion_id: direccion_id, // Guardar cliente_id desde external_reference
                items: items.map(item => ({
                    product_id: item.id,
                    title: item.title,
                    quantity: item.quantity,
                    price: item.unit_price
                })),
                total_price: transaction_amount,
                status: status,
                payment_id: paymentInfo.id
            });

            await nuevoPedido.save();
            for (const item of items) {
                await updateProductQuantity(item.id, item.quantity);
            }
            console.log('Pedido guardado:', nuevoPedido);
        } else if (topic === 'merchant_order') {
            // Obtener información de la orden
            const orderInfo = await fetchOrderInfo(id);
            console.log('Información de la orden:', orderInfo);

            if (orderInfo.status === 'closed' && orderInfo.payments.some(p => p.status === 'approved')) {
                const paymentId = orderInfo.payments[0].id;
                const numeroPedido = orderInfo.id;

                // Actualizar el pedido existente con el estado de pago
                await Pedido.findOneAndUpdate(
                    { numero_Pedido: numeroPedido },
                    { status: 'paid' }
                );
                console.log(`Pedido actualizado a 'paid' para el número de pedido: ${numeroPedido}`);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Error al procesar el webhook:', error.message);
        res.status(500).send('Error interno del servidor');
    }
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

// Función para actualizar la cantidad de productos
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

module.exports = {
    createPreference,
    handleWebhook, mostrarPedidos
};
