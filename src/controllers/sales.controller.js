import PaymentsService from "../services/payments.service.js";
import SalesService from "../services/sales.service.js";
import SalesDetailService from "../services/salesDetail.service.js";
import mercadopago from "mercadopago";
const sale = new SalesService();
const paymentService = new PaymentsService();
const saleDetail = new SalesDetailService();

const get = async (req, res) => {
    try {
        const response = await sale.find();
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await sale.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
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
            notification_url: `https://6272-187-225-56-173.ngrok-free.app/api/v1/sales/webhook`,
            // URLs a las que redirigir al usuario luego de completar el pago (éxito, falla, pendiente) -> frontend
            back_urls: {
                success: `http://localhost:3000/shop-cart/success`,
                failure: `${process.env.MERCADOPAGO_URL}/shop-cart`,
                pending: `${process.env.MERCADOPAGO_URL}/pending`
            },
        })
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const receiveWebhook = async (req, res) => {
    // Verificar que el payment provenga de Mercado Pago
    const payment = req.body;
    try {
        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment.data.id);
            // Obtener el objeto del metodo del pago que esta en la base de datos
            const paymentId =  await paymentService.findByName(data.body.payment_method_id)
            // ID del metodo de pago guardado en la base de datos
            const IdMethPay = paymentId.dataValues.id;
            
            //Llenado de la tabla de Ventas (Sales)

            

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
        const response = await sale.update(id, body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await sale.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    createInMercadoPago, receiveWebhook, get, getById, update, _delete
};
