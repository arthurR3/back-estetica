import mercadopago from "mercadopago";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import ServicesService from '../services/services.service.js'
import DatesService from "../services/dates.service.js";
import UsersService from "../services/users.service.js"
const service = new DatesService();
const usersService = new UsersService();
const serviceS = new ServicesService();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})


const sendEmail = async (email, citaData) => {
    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Confirmación de cita',
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            padding: 20px;
                        }
                        .container {
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            color: #666;
                            margin-bottom: 20px;
                        }
                        .cita-info {
                            border-top: 1px solid #ccc;
                            margin-top: 20px;
                            padding-top: 20px;
                        }
                        .cita-info p {
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Confirmación de cita</h1>
                        <p>Estimado/a ${citaData.nombre},</p>
                        <p>Su cita para el ${citaData.date} a las ${citaData.time} ha sido <b>AGENDADA</b>.</p>
                        <div class="cita-info">
                            <p><strong>Servicio:</strong> ${citaData.servicio}</p>
                            <p><strong>Dirección:</strong> Ubicación: Calle Velázquez Ibarra, Colonia Centro, Huejutla de Reyes Hidalgo</p>
                        </div>
                        <p>Deberá CONFIRMAR su cita 2 HORAS antes de su cita</p>
                        <p>Gracias por elegirnos. Esperamos verlo/a pronto. ESTETICA PRINCIPAL</p>
                    </div>
                </body>
            </html>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ', info.response);
        }
    });
};

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
        const response = await service.findOneUser(id);
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
        const user = await usersService.findByEmail(appointmentData.client.email)
        //const userId = appointmentData.userId;
        //const serviceId = appointmentData.service.id;
        if (user === null ) {
            const hashPassword = await bcrypt.hash('contraEstetica2@24', 10);

            const newUser = await usersService.create({
                id_role : 1,
                id_frequency : 1,
                name: appointmentData.client.name,
                last_name1: appointmentData.client.last_name1,
                last_name2: appointmentData.client.last_name2,
                email: appointmentData.client.email,
                password:hashPassword,
                phone: appointmentData.client.phone,
            })
            userId = newUser.dataValues.id;
        }
        userId = user.id
        console.log(userId)
        await service.create({
            id_user: userId,
            id_service: appointmentData.service.id,
            id_payment: 6,
            date: appointmentData.date,
            time: appointmentData.time,
            paid: 0, // Pago inicialmente en 0
            remaining: appointmentData.service.price, // Restante igual al precio del servicio
            payment_status: 'pendiente',
            date_status: 'pendiente' // Estado de la cita también inicialmente como "pendiente"
        });
        
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
            notification_url: `https://74e9-201-111-151-167.ngrok-free.app/api/v1/dates/reciveWebHook/${userId}`,
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
    const user = await usersService.findOne(userId)
    const payment = await service.findOneDate(userId);
    console.log(payment)
   const serviceData = await serviceS.findOne(payment.dataValues.id_service)

    try {
        if (appointment.type === "payment") {
            console.log(appointment, payment)
            // Actualiza el estado de pago a "pagado"
            await service.update(payment.dataValues.id,{
                paid:payment.dataValues.remaining/2,
                remaining: payment.dataValues.remaining/2,
                payment_status: 'pendiente',
                date_status: 'confirmada' // Podrías actualizar el estado de la cita también
            });
            const citaData = {
                nombre: user.dataValues.name + ' ' + user.dataValues.last_name1 + ' ' + user.dataValues.last_name2,
                date: payment.dataValues.date,
                time :payment.dataValues.time,
                servicio: serviceData.dataValues.name

            }
            await sendEmail(user.dataValues.email, citaData)

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
