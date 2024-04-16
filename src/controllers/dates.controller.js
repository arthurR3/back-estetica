import mercadopago from "mercadopago";
import DatesService from "../services/dates.service.js";
import UsersNRService from "../services/userNoRegistred.service.js"
const service = new DatesService();
const usersNR = new UsersNRService();
const get = async (req, res) => {
    try {
        const response = await service.find();
        return res.json(response);

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}



const create = async (req, res) => {
    try {

        const response = await service.create(req.body);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const createAppointment = async (req, res) => {
    try {
        const appointmentData = req.body;
        let userId;
        const user = usersNR.findByEmail(appointmentData.client.email)
        //const userId = appointmentData.userId;
        //const serviceId = appointmentData.service.id;
        if (!user) {
            const newUser = await usersNR.create({
                name: appointmentData.client.name,
                last_name1: appointmentData.client.last_name1,
                last_name2: appointmentData.client.last_name2,
                email: appointmentData.client.email,
                phone: appointmentData.client.phone,
            })
            userId = newUser.dataValues.id;
            console.log(newUser)
        }   
        userId = user.id;
        /* await service.create({
            id_user: userId,
            id_service: appointmentData.service.id,
            id_payment: 6,
            date: appointmentData.date,
            time: appointmentData.time,
            paid: 0, // Pago inicialmente en 0
            remaining: appointmentData.service.price, // Restante igual al precio del servicio
            payment_status: 'pendiente',
            date_status: 'pendiente' // Estado de la cita también inicialmente como "pendiente"
        }); */
        
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        })

        const appointment = await mercadopago.preferences.create({
            items: [{
                title: appointmentData.service.name,
                unit_price: appointmentData.service.price / 2,
                quantity: 1,
                currency_id: "MXN",
            },
            ],
            // URL a la que Mercado Pago enviará notificaciones sobre la cita (API)
            notification_url: `https://4db4-200-68-173-8.ngrok-free.app/api/v1/dates/reciveWebHook/${userId}`,
            // URLs a las que rdirigir al usuario luego de completar la cita (éxito, falla, pendiente) -> frontend
            back_urls: {
                success: `http://localhost:3000/success`,
                failure: `${process.env.MERCADOPAGO_URL}/appointments`,
                pending: `${process.env.MERCADOPAGO_URL}/appointments/pending`
            },
        });

        res.json({ success: true, data: appointment });

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const AppointmentWebhook = async (req, res) => {
    const appointment = req.body;
    const userId = req.params.id;
    const payment = await service.findOne({ where: { id_user: userId, payment_status: 'pendiente' } });

    try {
        if (appointment.type === "payment") {
            console.log(appointment, payment)
            // Actualiza el estado de pago a "pagado"
            /*   service.update({
                  paid: appointment.remaining,
                  remaining: 0,
                  payment_status: 'pagado',
                  date_status: 'confirmada' // Podrías actualizar el estado de la cita también
              }); */

            // Realiza otras acciones necesarias, como enviar una confirmación al usuario
        }
        res.json({ success: true, message: 'Appointment created successfully' });

} catch (error) {
    console.error('Error al procesar notificación de Mercado Pago:', error.message);
    res.sendStatus(500); // Responder con un código 500 en caso de error
}
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await service.update(id, body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, createAppointment, AppointmentWebhook, get, getById, update, _delete
};
