const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
// const client = new MercadoPagoConfig({ accessToken: 'TEST-8471721774041627-020813-1c3532061597970afbd2677b5ee2decf-1675220706' });
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7172160553657439-020914-9df24837ed5956ff57587899c330c517-1676959066' });


const router = express.Router();


router.get("/", (req, res) => {
    res.send("Soy el servidor MERCADO PAGO :)");
});

router.post("/create_preference", async (req, res) => {
    try {
        console.log("Cuerpo de la solicitud recibida:", req.body);
        console.log("Cuerpo de la solicitud recibida:", req.body);
        // Recibiendo los productos del carrito desde el cuerpo de la solicitud
        const { products } = req.body;

        console.log("Productos del carrito:", products); // Agregamos este registro de consola

        // Verificando si hay productos en la solicitud
        if (!products || products.length === 0) {
            console.log("No se proporcionaron productos en la solicitud."); // Agregamos este registro de consola
            return res.status(400).json({
                error: "No se proporcionaron productos en la solicitud."
            });
        }

        // Mapeando los productos recibidos para crear un arreglo de items para MercadoPago
        const items = products.map(product => ({
            title: product.title,
            quantity: Number(product.quantity),
            unit_price: Number(product.price),
            currency_id: "MXN"
        }));

        console.log("Items para MercadoPago:", items); // Agregamos este registro de consola

        // Creando la preferencia de MercadoPago
        const preference = new Preference(client);

        preference.create({
            body: {
                items,
                back_urls: {
                    success: "http://localhost:4200/success",
                    failure: "https://youtu.be/5SiW4UWAf8g?list=RD5SiW4UWAf8g",
                    pending: "https://youtu.be/5SiW4UWAf8g?list=RD5SiW4UWAf8g"
                },
                auto_return: "approved"
            }
        })
            .then(preferenceResult => {
                console.log("Preferencia creada:", preferenceResult); // Agregamos este registro de consola
                // Enviando la respuesta con el ID de la preferencia creada
                res.json({
                    id: preferenceResult.id,
                    init_point: preferenceResult.init_point 
                });
            })
            .catch(error => {
                console.log("Error al crear la preferencia:", error); // Agregamos este registro de consola
                res.status(500).json({
                    error: "Error al crear la preferencia."
                });
            });
    } catch (error) {
        console.log("Error en el manejo de la solicitud:", error); // Agregamos este registro de consola
        res.status(500).json({
            error: "Error en el manejo de la solicitud."
        });
    }
});

module.exports = router;