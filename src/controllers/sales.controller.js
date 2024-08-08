import axios from "axios";
import PaymentsService from "../services/payments.service.js";
import SalesService from "../services/sales.service.js";
import CartsService from '../services/carts.service.js';
import SalesDetailService from "../services/salesDetail.service.js";
import mercadopago from "mercadopago";
import ProductsService from "../services/products.service.js";
import AddressesService from "../services/addresses.service.js";
import CategoriesService from '../services/categories.service.js'
import BrandsService from '../services/brands.service.js'
import MailService from "../services/notification.service.js";
import UsersService from "../services/users.service.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_ACCESS)
const addressesService = new AddressesService();
const productService = new ProductsService();
const cartService = new CartsService();
const saleService = new SalesService();
const saleDetailService = new SalesDetailService();
const paymentService = new PaymentsService();
const categoryService = new CategoriesService();
const brandService = new BrandsService();
const mailService = new MailService();
const userService = new UsersService();


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
        const sales = await saleService.findByUserId(id);
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
// Simulando pago
const simulatePayment = async (req, res) => {
    try {
       // console.log('Simulating payment...');

        const { total, UserId, productos } = req.body;

        // Verificar si productos está definido y es un array
        if (!productos || !Array.isArray(productos)) {
            throw new Error('Productos no definidos o no es un array');
        }

       // console.log('Productos:', productos);
       // console.log('Total:', total);
       // console.log('UserId:', UserId);

        // Asegúrate de que los nombres de los campos sean correctos
        const items = productos.map(producto => ({
            title: producto.nombre,
            unit_price: total / productos.length,
            quantity: 1,
            currency_id: "MXN",
        }));

       // console.log('Items:', items);

        const result = {
            id: Math.floor(Math.random() * 1000000), // ID simulado
            items: items,
            total: total,
            userID: UserId
        };

     //   console.log('Result:', result);

        const webhookUrl = `http://localhost:5000/api/v1/sales/webhook/${UserId}`;
        //console.log('Webhook URL:', webhookUrl);

        const paymentData = {
            type: "payment",
            data: {
                id: result.id,
                transaction_amount: total,
                payment_method_id: "simulated_method",
                payment_type_id: "simulated_type"
            }
        };

       // console.log('Payment data:', paymentData);

        const axiosResponse = await axios.post(webhookUrl, paymentData);
      //  console.log('Webhook response:', axiosResponse.data);

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
       // console.log('Mercado Pago configured with access token');

        // Obtener datos de la solicitud
        const response = req.body;
        //console.log('Request body:', response);

        // Preparar los datos de los ítems
        const total = response.total;
        const userID = response.UserId;
        /* console.log('Total amount:', total);
        console.log('User ID:', userID); */

        const items = response.productos.map(producto => ({
            title: producto.nombre,
            unit_price: total / response.productos.length,
            quantity: 1,
            currency_id: "MXN",
        }));
        //console.log('Items prepared for Mercado Pago:', items);
        /*5474 9254 3267 0366*/
        // Crear la preferencia en Mercado Pago
        const result = await mercadopago.preferences.create({
            items: items,
            // URL a la que Mercado Pago enviará notificaciones sobre el pago (API)
            notification_url: `https://25a1-201-97-136-222.ngrok-free.app/api/v1/sales/webhook/${userID}`,
            // URLs a las que redirigirá al usuario luego de completar el pago (éxito, falla, pendiente)
            back_urls: {
                success: `http://localhost:3000/shop-cart/details`,
                failure: `${process.env.MERCADOPAGO_URL}/shop-cart`,
                pending: `${process.env.MERCADOPAGO_URL}/pending`
            },
            auto_return: "approved"
        });
       // console.log('Mercado Pago preference created:', result);

        // Enviar respuesta al cliente
        res.json({ success: true, data: result });

    } catch (error) {
        // Capturar y enviar error
        console.error('Error creating Mercado Pago preference:', error.message);
        res.status(500).send({ success: false, message: error.message });
    }
};
/* const receiveWebhook = async (req, res) => {
    try {
        console.log('Received webhook notification');

        const payment = req.body;
        const userId = req.params.id;

        if (payment.type === "payment") {
            const address = await addressesService.findOne(userId);
            if (!address) {
                throw new Error('Address not found for user');
            }
            console.log('Address from database:', address);

            let paymentId = await paymentService.findByName(payment.data.payment_method_id);
            if (!paymentId) {
                paymentId = await paymentService.create({
                    type: payment.data.payment_method_id,
                    add_info: payment.data.payment_type_id
                });
            }
            console.log('Payment ID from database:', paymentId);

            const IdMethPay = paymentId.dataValues.id;

            const newSale = await saleService.create({
                id_user: userId,
                id_payment: IdMethPay,
                id_address: address.id,
                shipping_status: "En proceso",
                total: payment.data.transaction_amount,
                date: new Date()
            });
            console.log('New sale created:', newSale);

            const idSale = newSale.dataValues.id;
            console.log('Sale ID:', idSale);

            const saleDetails = await axios.get(`http://localhost:5000/api/v1/carts/${userId}`);
            const products = saleDetails.data.data;

            const resSaleDetail = await saleDetailService.create(products, idSale);
            console.log('Sale detail created:', resSaleDetail);

            // Elimina productos del carrito
            await axios.delete(`http://localhost:5000/api/v1/carts/${userId}`);
            console.log('Cart cleared for user:', userId);

            res.json({ success: true, message: 'Sale created successfully' });

        } else {
            console.log('Payment type is not "payment".');
            res.json({ success: false, message: 'Invalid payment type' });
        }

    } catch (error) {
        console.error('Error processing webhook notification:', error.message);
        res.status(500).send({ success: false, message: error.message });
    }
}; */

const receiveWebhook = async (req, res) => {
    const payment = req.body;
    const userId = req.params.id;

    try {
        if (payment.type === "payment") {
            //console.log(payment)
           // console.log(payment)
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
           const response = await axios.get(`http://localhost:5000/api/v1/carts/${userId}`);
            const products = response.data.data;

            //const response = cartService.findOne(userId)
            //const products = response;
            await saleDetailService.create(products, idSale);

            // Eliminar productos del carrito
            await axios.delete(`http://localhost:5000/api/v1/carts/${userId}`);
            //await cartService.delete(userId);
            const detailSales = {
                idSale,
                transactionAmount: data.transaction_amount,
                products,
                address
            };
            const user = await userService.findOne(userId); // Asumiendo que tienes un servicio para obtener el correo del usuario
            //console.log(user.email)
            await mailService.confirmationCompra(user.email, detailSales);

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


const createSession = async (req, res) => {
    const response = req.body;
    const total = response.total;
    const userID = response.UserId;
    try {
        const line_items = response.productos.map(producto => ({
            price_data:{
                currency: 'mxn',
                product_data:{
                    name: producto.nombre,
                },
                unit_amount: producto.unit_amount,
            },
            quantity: producto.quantity
        }))
        const session  = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode: 'payment',
            success_url: `https://estetica-principal.netlify.app/shop-cart/success?session_id={CHECKOUT_SESSION_ID}&userID=${userID}`,
            cancel_url: 'https://estetica-principal.netlify.app/shop-cart',
            client_reference_id: userID,
            metadata:{
                productos: JSON.stringify(response.productos),
            }
        })
    
        return res.json({url: session.url})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const receiveComplete = async (req, res) =>{
    const {sessionId, userID } = req.body;
   // console.log(sessionId)
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const address = await addressesService.findOne(userID);

        let paymentId = await paymentService.findByName('visa');
        const IdMethPay = paymentId.dataValues.id;
        const newSale = await saleService.create({
            id_user: userID,
            id_payment: IdMethPay,
            id_address: address.id,
            shipping_status: "En proceso",
            total: session.amount_total / 100,
            date: new Date()
        });
        const productos = JSON.parse(session.metadata.productos);
        const idSale = newSale.dataValues.id;
        const detailSales = {
            idSale,
            transactionAmount: session.amount_total / 100,
            productos,
        };
        await saleDetailService.create(productos, idSale);

        await cartService.delete(userID);
        const user = await userService.findOne(userID);
        //console.log(user.email, detailSales) // Asumiendo que tienes un servicio para obtener el correo del usuario
        await mailService.confirmationCompra(user.email, detailSales);
        return res.json({ message: 'Compra completada exitosamente' });

    } catch (error) {
        return res.status(500).json({ message: 'Error al completar la compra', error: error });

    }
}   

const getTotalDeliveredSales = async (req, res) => {
    try {
        const totalIncome = await saleService.getTotalDeliveredSales();
        res.json({ total: totalIncome });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el total de ventas entregadas' });
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
    createSession, getTotalDeliveredSales, simulatePayment, receiveComplete, get, getById, update, _delete
};
