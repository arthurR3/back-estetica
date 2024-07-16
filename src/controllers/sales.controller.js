import axios from "axios";
import PaymentsService from "../services/payments.service.js";
import SalesService from "../services/sales.service.js";
import CartsService from "../services/carts.service.js";
import SalesDetailService from "../services/salesDetail.service.js";
import mercadopago from "mercadopago";
import ProductsService from "../services/products.service.js";
import AddressesService from "../services/addresses.service.js";
const addressesService = new AddressesService();
const productService = new ProductsService();
const cartService = new CartsService();
const saleService = new SalesService();
const saleDetailService = new SalesDetailService();
const paymentService = new PaymentsService();

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
                saleInfo.details.push({
                    id: detail.id,
                    id_sale: detail.id_sale,
                    id_product: detail.id_product,
                    product_name: product.name,
                    image_product : product.image,
                    amount: detail.amount,
                    unit_price: detail.unit_price,
                    subtotal: detail.subtotal
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
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        })

        const response = req.body;
        const total = response.total;
        const userID = response.UserId
        const items = response.productos.map(producto => ({
            title: producto.nombre,
            unit_price: total / response.productos.length,
            quantity: 1,
            currency_id: "MXN",
        }));
        const result = await mercadopago.preferences.create({
            items: items,
            // URL a la que Mercado Pago enviará notificaciones sobre el pago (API)
            notification_url: `https://f0e0-201-105-21-144.ngrok-free.app/api/v1/sales/webhook/${userID}`,
            // URLs a las que redirignpm ir al usuario luego de completar el pago (éxito, falla, pendiente) -> frontend
            back_urls: {
                success: `http://localhost:3000/shop-cart/details`,
                failure: `${process.env.MERCADOPAGO_URL}/shop-cart`,
                pending: `${process.env.MERCADOPAGO_URL}/pending`
            },
            auto_return: "approved"
        })
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const receiveWebhook = async (req, res) => {
    // Verificar que el payment provenga de Mercado Pago
    const payment = req.body;
    const userId = req.params.id
    const response = await axios.get(`http://localhost:5000/api/v1/carts/${userId}`)
    const products = response.data.data;
    try {
        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment.data.id);
            // Obtener el objeto del metodo del pago que esta en la base de datos
            const address = await addressesService.findOne(userId)
            const paymentId = await paymentService.findByName(data.body.payment_method_id)
            // ID del metodo de pago guardado en la base de datos
            const IdMethPay = paymentId.dataValues.id;
            //console.log(IdMethPay, userId)
            //Llenado de la tabla de Ventas (Sales)
            const newSale = await saleService.create({
                id_user: userId,
                id_payment: IdMethPay,
                id_address: address.id,
                shipping_status: "En proceso",
                total: data.body.transaction_amount,
                date: new Date()
            })
            //Obtengo el id de la venta (Se utilizara en el detalle venta)
            const idSale = newSale.dataValues.id
            const res = await saleDetailService.create(products, idSale)
            if (res) {
                await axios.delete(`http://localhost:5000/api/v1/carts/${userId}`)
            }
        }
        res.json({ success: true, message: 'Sale created successfully' });

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
