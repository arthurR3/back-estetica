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
        let appointment;

        //console.log(JSON.stringify(appointmentData, null, 2)); // Mejora la visibilidad del log
        // Buscar el usuario por email
        let user = await usersService.findByEmail(appointmentData.customer.email);

        if (!user) {
            // Si el usuario no existe, crear uno nuevo
            const hashPassword = await bcrypt.hash('contraEstetica2@24', 10); // Contraseña provisional

            const newUser = await usersService.create({
                id_role: 1,
                id_frequency: 1,
                name: appointmentData.customer.nombre,
                last_name1: appointmentData.customer.apellido,
                last_name2: appointmentData.customer.apellidoMat,
                email: appointmentData.customer.email,
                password: hashPassword,
                phone: appointmentData.customer.telefono,
            });
            userId = newUser.dataValues.id;
        } else {
            userId = user.id;
        }

        let total_price = appointmentData.total;

        // Crear una cita para cada servicio con su respectivo horario
        for (const serviceInfo of appointmentData.data.selectedServices) {
            await service.create({
                id_user: userId,
                id_service: serviceInfo.id,
                id_payment: 6, // ID de pago temporal; ajusta según tu lógica
                date: appointmentData.data.selectedDate,
                time: appointmentData.data.selectedTime,
                paid: 0, // Pago inicialmente en 0
                remaining: serviceInfo.price, // Restante igual al precio del servicio
                payment_status: 'pendiente',
                date_status: 'pendiente' // Estado de la cita también inicialmente como "pendiente"
            });
        }

        // Configurar MercadoPago y crear preferencia de pago
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });

        // Crear preferencia de pago para todos los servicios
        appointment = await mercadopago.preferences.create({
            items: [{
                title: 'Total de servicios',
                unit_price: total_price,
                quantity: 1,
                currency_id: "MXN",
            }],
            notification_url: `https://342a-201-97-106-237.ngrok-free.app/api/v1/dates/reciveWebHook/${userId}`,
            back_urls: {
                success: `http://localhost:3000/user-info/citas-agendadas`,
                failure: `${process.env.MERCADOPAGO_URL}/appointments`,
                pending: `${process.env.MERCADOPAGO_URL}/appointments/pending`
            },
        });

        res.json({ success: true, data: appointment });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};


//   const serviceData = await serviceS.findOne(payment.dataValues.id_service)

const AppointmentWebhook = async (req, res) => {
    const appointment = req.body;
    const userId = req.params.id;
    const user = await usersService.findOne(userId);
    const payments = await service.findOneDate(userId); // Obtener todas las citas pendientes del usuario
    try {
        if (appointment.type === "payment") {
            for (const payment of payments) {
                // Actualiza el estado de pago a "pagado"
                await service.update(payment.id, {
                    paid: payment.remaining / 2,
                    remaining: payment.remaining / 2,
                    payment_status: 'pendiente',
                    date_status: 'programada' // Podrías actualizar el estado de la cita también
                });
            }

            // Obtener información de los servicios agendados
            const serviceData = await serviceS.findAll(payments.map(payment => payment.dataValues.id_service));

            // Enviar correo de confirmación para cada cita
            for (let i = 0; i < payments.length; i++) {
                const citaData = {
                    nombre: user.name + ' ' + user.last_name1 + ' ' + user.last_name2,
                    date: payments[i].date,
                    time: payments[i].timeStart,
                    time2 : payments[i].timeEnd,
                    servicio: serviceData[i].name
                }
                await sendEmail(user.email, citaData);
            }
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
        const response = await service.delete(id)
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, createAppointment, AppointmentWebhook, get, getById, update, _delete
};
