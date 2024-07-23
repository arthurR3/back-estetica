import mercadopago from "mercadopago";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import ServicesService from '../services/services.service.js'
import DatesService from "../services/dates.service.js";
import UsersService from "../services/users.service.js"
import DateDetailService from "../services/datesDetail.service.js";
import { response } from "express";
const service = new DatesService();
const usersService = new UsersService();
const serviceS = new ServicesService();
const datesDetail = new DateDetailService()
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

// Recordatorio de citas
/* const checkAndSendReminders = async () => {
  try {
    const response = await axios.get('http://tu-api-url/appointments');
    const appointments = response.data;

    const now = new Date();

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const hoursDifference = (appointmentDate - now) / 36e5;

      if (hoursDifference >= 23 && hoursDifference < 24) {
        sendEmail(
          appointment.Usuario.email,
          'Recordatorio de Cita',
          `Tiene una cita en 24 horas. Por favor, confirme.`
        );
      } else if (hoursDifference >= 1 && hoursDifference < 2) {
        if (appointment.date_status !== 'Confirmada') {
          sendEmail(
            appointment.Usuario.email,
            'Recordatorio de Cita',
            `Su cita es en 2 horas. Por favor, confirme o reprograme, de lo contrario será cancelada.`
          );
        } else {
          sendEmail(
            appointment.Usuario.email,
            'Recordatorio Amistoso',
            `Tiene una cita confirmada en 2 horas. ¡No olvide asistir!`
          );
        }
      } else if (hoursDifference < 0 && appointment.date_status !== 'Confirmada') {
        // Cancelar la cita
        axios.put(`http://tu-api-url/appointments/${appointment.id}`, {
          date_status: 'Cancelada',
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// Programar la tarea para que se ejecute cada hora
cron.schedule('0 * * * *', () => {
  console.log('Ejecutando tarea programada');
  checkAndSendReminders();
}); */

const get = async (req, res) => {
    try {
        const response = await service.find();
        return res.json(response);

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getByDate = async (req, res) => {
    try {
        const response = await service.findDate()
        return res.json(response.map(cita => cita.date))
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}
const getCounts = async (req, res) => {
    try {
        const response = await service.countStatus()
        return res.json(response);
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}

// Método para manejar la solicitud en el controlador
const getByTime = async (req, res) => {
    const { date } = req.body;

    // Validar la existencia y formato de la fecha
    if (!date) {
        return res.status(400).send({ success: false, message: "Date is required" });
    }

    // Validar el formato de la fecha (opcional, dependiendo de cómo esté guardada en la base de datos)
    const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/;
    if (!datePattern.test(date)) {
        return res.status(400).send({ success: false, message: "Invalid date format" });
    }

    try {
        const response = await service.findBookedSlots(date);
        return res.json({ success: true, slots: response });
    } catch (error) {
        console.error('Error en getByTime:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.findOneUser(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await service.findByUserId(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    const data = req.body;
    try {
        // Crear la cita principal
        const newDate = {
            id_user: data.id_user,
            id_payment: data.id_payment,
            date: data.date,
            time: data.time,
            paid: data.paid,
            remaining: data.remaining,
            payment_status: data.payment_status,
            date_status: data.date_status
        };
        const response = await service.create(newDate)
        const serviceDetails = await serviceS.findOne(data.id_service);
        if (!serviceDetails) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        // Crear el detalle de la cita usando el id de la cita creada y los detalles del servicio
        await datesDetail.create({
            id_date: response.dataValues.id,
            id_service: serviceDetails.id,
            price: serviceDetails.price,
            duration: serviceDetails.duration
        });


        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};
  

const createAppointment = async (req, res) => {
    try {
        const { customer, total, data } = req.body;
        let userId;
        let user = await usersService.findByEmail(customer.email);

        if (!user) {
            // Crear un nuevo usuario si no existe
            const hashPassword = await bcrypt.hash('contraEstetica2@24', 10);
            console.log("Hashed Password:", hashPassword);

            const newUser = await usersService.create({
                id_role: 1,
                id_frequency: 1,
                name: customer.nombre,
                last_name1: customer.apellido,
                last_name2: customer.apellidoMat,
                email: customer.email,
                password: hashPassword,
                phone: customer.telefono,
            });
            userId = newUser.dataValues.id;
        } else {
            userId = user.id;
        }

        // Crear una única cita para el usuario
        const newAppointment = await service.create({
            id_user: userId,
            id_payment: 6,
            date: data.date,
            time: data.time,
            total_price: total,
            paid: 0,
            remaining: total,
            payment_status: 'pendiente',
            date_status: 'pendiente'
        });

        // Crear detalles de la cita para cada servicio seleccionado
        const detailsPromises = data.service.map(async (serviceInfo) => {
            await datesDetail.create({
                id_date: newAppointment.dataValues.id,
                id_service: serviceInfo.id,
                price: serviceInfo.price,
                duration: serviceInfo.duration
            });
        });

        await Promise.all(detailsPromises);

        // Configurar MercadoPago y crear preferencia de pago
        mercadopago.configure({
            access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
        });

        const appointment = await mercadopago.preferences.create({
            items: [{
                title: 'Total de servicios',
                unit_price: total,
                quantity: 1,
                currency_id: "MXN",
            }],
            notification_url: `https://back-estetica-production-710f.up.railway.app/api/v1/dates/reciveWebHook/${userId}`,
            back_urls: {
                success: `https://estetica-principal.netlify.app//user-info/citas-agendadas`,
                failure: `${process.env.MERCADOPAGO_URL}/appointments`,
                pending: `${process.env.MERCADOPAGO_URL}/appointments/pending`
            },
        });
        console.log("Payment Preference Created");

        res.json({ success: true, data: appointment });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).send({ success: false, message: error.message });
    }
};

const AppointmentWebhook = async (req, res) => {
    const { body: appointment, params: { id: userId } } = req;
    try {
        const user = await usersService.findOne(userId);
        const appointments = await service.findOneDate(userId); // Cambiado de 'payments' a 'appointments'
        console.log("Appointment Data:", appointments);

        if (appointment.type === "payment") {
            const appointmentPromises = appointments.map(async (appointment) => {
                // Actualiza el estado de pago a "pagado"
                await service.update(appointment.id, {
                    paid: appointment.remaining / 2,
                    remaining: appointment.remaining / 2,
                    payment_status: 'pendiente',
                    date_status: 'P_Confirmar'
                });
            });

            await Promise.all(appointmentPromises);
        }

        res.json({ success: true, message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Error al procesar notificación de Mercado Pago:', error.message);
        res.sendStatus(500); // Responder con un código 500 en caso de error
    }
};



const cancelation = async (req, res) => {
    const {idCita, reason, id_user, email} = req.body;
    const appointment = service.findOneUser(id_user);
    try {
        if(!appointment){
            return res.status(404).send({success: false, message: 'No existe una cita para ese usuario'})
        }
        const status = appointment.status = 'Cancelada'
        await service.update(idCita,status)
        await sendEmail(email, 'Cita Cancelada', `Tu cita a sido cancelada. Motivo ${reason}`);
    } catch (error) {
        
    }
}

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
    create, createAppointment, AppointmentWebhook, get, getByTime, getById, getCounts,getByDate, getByUserId, update, _delete
};
