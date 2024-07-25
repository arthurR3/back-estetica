import axios from "axios";
import PaymentsService from "../services/payments.service.js";
import SalesService from "../services/sales.service.js";
import CartsService from "../services/carts.service.js";
import SalesDetailService from "../services/salesDetail.service.js";
import mercadopago from "mercadopago";
import ProductsService from "../services/products.service.js";
import AddressesService from "../services/addresses.service.js";
import CategoriesService from '../services/categories.service.js'
import BrandsService from '../services/brands.service.js'

const addressesService = new AddressesService();
const productService = new ProductsService();
const cartService = new CartsService();
const saleService = new SalesService();
const saleDetailService = new SalesDetailService();
const paymentService = new PaymentsService();
const categoryService = new CategoriesService();
const brandService = new BrandsService();

const get = async (req, res) => {
    try {
        const response = await saleService.find();
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener las ventas del usuario por su ID
        const sales = await saleService.find(
            {
                where: {
                    id_user: id
                }
            }
        );
        const salesWithDetails = [];
        for (const sale of sales) {
            // Obtener los detalles de la venta por el ID de la venta
            const saleDetails = await saleDetailService.find({ where: { id_sale: sale.id } });

            // Crear un objeto con la información de la venta y sus detalles
            const saleInfo = {
                id: sale.id,
                id_user: sale.id_user,
                id_payment: sale.id_payment,
                id_address: sale.id_address,
                shipping_status: sale.shipping_status,
                total: sale.total,
                date: sale.date,
                details: []
            };

            // Agregar los detalles de la venta al objeto
            for (const detail of saleDetails) {
                const product = await productService.findOne(detail.id_product);
                const category = await categoryService.findOne(product.id_category);
                const brand = await brandService.findOne(product.id_brand);

                saleInfo.details.push({
                    id: detail.id,
                    id_sale: detail.id_sale,
                    id_product: detail.id_product,
                    product_name: product.name,
                    image_product: product.image,
                    amount: detail.amount,
                    unit_price: detail.unit_price,
                    subtotal: detail.subtotal,
                    category_id: product.id_category,
                    category_name: category.name,
                    brand_id: product.id_brand,
                    brand_name: brand.name
                });
            }
            salesWithDetails.push(saleInfo);
        }

        res.json({ success: true, data: salesWithDetails });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};
const simulatePayment = async (req, res) => {
    try {
        // Obtener datos de la solicitud
        const { total, userID, productos } = req.body;

        // Preparar los datos de los ítems
        const items = productos.map(producto => ({
            title: producto.nombre,
            unit_price: total / productos.length,
            quantity: 1,
            currency_id: "MXN",
        }));

        // Simular la creación de una preferencia de pago
        const result = {
            id: Math.floor(Math.random() * 1000000), // ID simulado
            items: items,
            total: total,
            userID: userID
        };

        // Enviar notificación simulada a la URL de notificación
        await axios.post(`https://back-estetica-production-710f.up.railway.app/api/v1/sales/webhook/${userID}`, {
            type: "payment",
            data: {
                id: result.id,
                transaction_amount: total,
                payment_method_id: "master",
                payment_type_id: "credit_card",
            }
        });

        res.json({ success: true, data: result });

    } catch (error) {
        console.error('Error simulating payment:', error.message);
        res.status(500).send({ success: false, message: error.message });
    }
};

const createInMercadoPago = async (req, res) => {
    try {
        // Configurar Mercado Pago
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });
        console.log('Mercado Pago configured with access token');

        // Obtener datos de la solicitud
        const response = req.body;
        console.log('Request body:', response);

        // Preparar los datos de los ítems
        const total = response.total;
        const userID = response.UserId;
        console.log('Total amount:', total);
        console.log('User ID:', userID);

        const items = response.productos.map(producto => ({
            title: producto.nombre,
            unit_price: total / response.productos.length,
            quantity: 1,
            currency_id: "MXN",
        }));
        console.log('Items prepared for Mercado Pago:', items);
        /*5474 9254 3267 0366*/
        // Crear la preferencia en Mercado Pago
        const result = await mercadopago.preferences.create({
            items: items,
            // URL a la que Mercado Pago enviará notificaciones sobre el pago (API)
            notification_url: `https://back-estetica-production-710f.up.railway.app/api/v1/sales/webhook/${userID}`,
            // URLs a las que redirigirá al usuario luego de completar el pago (éxito, falla, pendiente)
            back_urls: {
                success: `https://estetica-principal.netlify.app/shop-cart/details`,
                failure: `${process.env.MERCADOPAGO_URL}/shop-cart`,
                pending: `${process.env.MERCADOPAGO_URL}/pending`
            },
            auto_return: "approved"
        });
        console.log('Mercado Pago preference created:', result);

        // Enviar respuesta al cliente
        res.json({ success: true, data: result });

    } catch (error) {
        // Capturar y enviar error
        console.error('Error creating Mercado Pago preference:', error.message);
        res.status(500).send({ success: false, message: error.message });
    }
};


const receiveWebhook = async (req, res) => {
    const payment = req.body;
    const userId = req.params.id;

    try {
        if (payment.type === "payment") {
            const data = payment.data; // Datos simulados o de Mercado Pago

            // Obtener la dirección del usuario desde la base de datos
            const address = await addressesService.findOne(userId);

            // Obtener o crear el método de pago desde la base de datos
            let paymentId = await paymentService.findByName(data.payment_method_id);
            if (!paymentId) {
                paymentId = await paymentService.create({ type: data.payment_method_id, add_info: data.payment_type_id });
            }
            const IdMethPay = paymentId.dataValues.id;

            // Llenado de la tabla de Ventas (Sales)
            const newSale = await saleService.create({
                id_user: userId,
                id_payment: IdMethPay,
                id_address: address.id,
                shipping_status: "En proceso",
                total: data.transaction_amount,
                date: new Date()
            });
            const idSale = newSale.dataValues.id;

            // Obtener los productos del carrito del usuario
            const response = await axios.get(`https://back-estetica-production-710f.up.railway.app/api/v1/carts/${userId}`);
            const products = response.data.data;

            // Crear detalles de la venta
            for (const product of products) {
                await saleDetailService.create({
                    id_sale: idSale,
                    id_product: product.id,
                    amount: product.amount,
                    unit_price: product.price,
                    subtotal: product.price * product.amount
                });
            }

            // Eliminar productos del carrito
            await axios.delete(`https://back-estetica-production-710f.up.railway.app/api/v1/carts/${userId}`);

            // Enviar respuesta de éxito
            res.json({ success: true, message: 'Sale created successfully' });

        } else {
            res.json({ success: false, message: 'Invalid payment type' });
        }

    } catch (error) {
        console.error('Error processing webhook notification:', error.message);
        res.sendStatus(500);
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await saleService.update(id, body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await saleService.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    createInMercadoPago, simulatePayment, receiveWebhook, get, getById, update, _delete
};
