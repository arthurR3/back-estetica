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
    // Verificar que el payment provenga de Mercado Pago
    const payment = req.body;
    const userId = req.params.id;
    const response = await axios.get(`https://back-estetica-production-710f.up.railway.app/api/v1/carts/${userId}`)
    const products = response.data.data;

    console.log('Received payment:', payment);
    console.log('User ID:', userId);
    
    try {
        if (payment.type === "payment") {            // Obtener detalles del pago desde Mercado Pago
            const data = await mercadopago.payment.findById(payment.data.id);
            console.log('Payment data from Mercado Pago:', data);

            // Obtener la dirección del usuario desde la base de datos
            const address = await addressesService.findOne(userId);
            console.log('Address from database:', address);

            // Obtener el método de pago desde la base de datos
            const paymentId = await paymentService.findByName(data.body.payment_method_id);
            if(!paymentId){
                paymentId = await paymentService.create({type: data.body.payment_method_id, add_info:data.body.payment_type_id})
            }
            console.log('Payment ID from database:', paymentId);

            // ID del método de pago guardado en la base de datos
            const IdMethPay = paymentId.dataValues.id;

            // Llenado de la tabla de Ventas (Sales)
            const newSale = await saleService.create({
                id_user: userId,
                id_payment: IdMethPay,
                id_address: address.id,
                shipping_status: "En proceso",
                total: data.body.transaction_amount,
                date: new Date()
            });
            console.log('New sale created:', newSale);

            // Obtengo el id de la venta (Se utilizara en el detalle venta)
            const idSale = newSale.dataValues.id;
            console.log('Sale ID:', idSale);

            // Crear detalles de la venta
            const resSaleDetail = await saleDetailService.create(products, idSale);
            console.log('Sale detail created:', resSaleDetail);

            // Eliminar productos del carrito
            if (resSaleDetail) {
                await axios.delete(`https://back-estetica-production-710f.up.railway.app/api/v1/carts/${userId}`);
                console.log('Cart cleared for user:', userId);
            }

            // Enviar respuesta de éxito
            res.json({ success: true, message: 'Sale created successfully' });

        } else {
            console.log('Payment type is not "payment".');
            res.json({ success: false, message: 'Invalid payment type' });
        }

    } catch (error) {
        console.error('Error al procesar notificación de Mercado Pago:', error.message);
        res.sendStatus(500); // Responder con un código 500 en caso de error
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
    createInMercadoPago, receiveWebhook, get, getById, update, _delete
};
