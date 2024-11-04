import mercadopago from "mercadopago";
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import ServicesService from '../services/services.service.js'
import DatesService from "../services/dates.service.js";
import UsersService from "../services/users.service.js"
import DateDetailService from "../services/datesDetail.service.js";
import MailService from "../services/notification.service.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_ACCESS)
const mailService = new MailService()
const service = new DatesService();
const usersService = new UsersService();
const serviceS = new ServicesService();
const datesDetail = new DateDetailService()


function generateRandomPassword(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

const generateUniqueCode = async () => {
    const codeExists = async (code) => {
        const user = await usersService.findByCode(code);
        return !!user;
    };

    let code;
    let exists = true;

    while (exists) {
        let randomNumber = Math.floor(Math.random() * 100000);
        code = String(randomNumber).padStart(5, '0');
        exists = await codeExists(code); // Esta función debe verificar si el código ya existe
    }

    return code;
};

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
  
const createSinPago = async (req, res) => {
    const { customer, total, data } = req.body;
    let userId;
    let userEmail;
    let tempPassword;
    let user = await usersService.findByEmail(customer.email);
    const code = await generateUniqueCode();

    try {
        if (!user) {
            // Crear un nuevo usuario si no existe
            tempPassword = generateRandomPassword(12); // Generar una contraseña temporal
            const hashPassword = await bcrypt.hash(tempPassword, 10);
            const newUser = await usersService.create({
                id_role: 1,
                id_frequency: 1,
                name: customer.nombre,
                last_name1: customer.apellido,
                last_name2: customer.apellidoMat,
                email: customer.email,
                password: hashPassword,
                phone: customer.telefono,
                code: code
            });
            userId = newUser.dataValues.id;
            user = newUser.dataValues;
            userEmail = customer.email;
        } else {
            userId = user.id;
            userEmail = user.email;
        }

        // Crear la cita
        const newDate = {
            id_user: userId,
            id_payment: 5,
            date: data.date,
            time: data.time,
            paid: 0,
            remaining: total,
            payment_status: 'Pendiente',
            date_status: 'P_Confirmar'
        };
        const response = await service.create(newDate);

        // Obtener los servicios seleccionados
        const detailsPromises = data.service.map(async (serviceInfo) => {
            await datesDetail.create({
                id_date: response.id,
                id_service: serviceInfo.id,
                price: serviceInfo.price,
                duration: serviceInfo.duration
            });
        });

        await Promise.all(detailsPromises);
        // Preparar los datos para el correo
        const citaData = {
            idCita: response.id,
            idUser: userId,
            nombre: `${user.name} ${user.last_name1}`, // Asumiendo que 'customer' contiene el nombre
            servicio: await Promise.all(data.service.map(async (serviceInfo) => {
                return {
                    name: serviceInfo.name,
                    price: serviceInfo.price
                };
            })),
            date: data.date,
            time: data.time,
            payment_status: 'Pendiente'
        };

        // Enviar correo basado en si el usuario es nuevo o ya está registrado
        if (tempPassword) {
            // Nuevo usuario
            await mailService.sendRegistrationEmail(userEmail, tempPassword, citaData);
        } else {
            // Usuario ya registrado
            await mailService.sendConfirmation(userEmail, citaData);
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ success: false, message: 'Error al crear la cita' });
    }
}

const createSession = async (req, res) => {
    const { customer, total, data } = req.body;
    try {
        const dataComplete = {
             customer,
             reserva: {date: data.date, time: data.time},
             servicio: data.service.map(service =>({
                id: service.id,
                name: service.name,
                price: service.price,
                duration: service.duration,
             })),
             total
        }

        const line_items = data.service.map(service =>({
            price_data :{
                currency: 'mxn',
                product_data : {
                    name : service.name
                },
                unit_amount: (Math.round(service.price * 100) / 2)
            },
        quantity: 1 
    }))
    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&userID=${customer.email}`,
        cancel_url: `http://localhost:3000/cancel?session_id={CHECKOUT_SESSION_ID}`,
        customer_email: customer.email,
        metadata: {data : JSON.stringify(dataComplete)}
    })
    return res.json({url:session.url})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
}

const receiveComplete =  async (req, res) =>{
    const {sessionId, userID} = req.body;
    let userId;
    let userEmail;
    let tempPassword;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        const data = JSON.parse(session.metadata.data)
        console.log(data)

        let user = await usersService.findByEmail(userID);
        const code = await generateUniqueCode()
        if (!user) {
            // Crear un nuevo usuario si no existe
            tempPassword = generateRandomPassword(12); // Generar una contraseña temporal
            const hashPassword = await bcrypt.hash(tempPassword, 10);
            const newUser = await usersService.create({
                id_role: 1,
                id_frequency: 1,
                name: data.customer.nombre,
                last_name1: data.customer.apellido,
                last_name2: data.customer.apellidoMat,
                email: data.customer.email,
                password: hashPassword,
                phone: data.customer.telefono,
                code: code
            });
            userId = newUser.dataValues.id;
            user = newUser.dataValues;
            userEmail = customer.email;
        } else {
            userId = user.id;
            userEmail = user.email;
        }

        const newDate = {
            id_user: userId,
            id_payment: 5,
            date: data.reserva.date,
            time: data.reserva.time,
            paid:( data.total/2).toFixed(2),
            remaining: (data.total/2).toFixed(2),
            payment_status: 'Pendiente',
            date_status: 'P_Confirmar'
        };

        const response = await service.create(newDate);

        // Obtener los servicios seleccionados
        const detailsPromises = data.servicio.map(async (serviceInfo) => {
            await datesDetail.create({
                id_date: response.id,
                id_service: serviceInfo.id,
                price: serviceInfo.price,
                duration: serviceInfo.duration
            });
        });

        await Promise.all(detailsPromises);
        // Preparar los datos para el correo
        const citaData = {
            idCita: response.id,
            idUser: userId,
            nombre: `${user.name} ${user.last_name1}`, // Asumiendo que 'customer' contiene el nombre
            servicio: await Promise.all(data.servicio.map(async (serviceInfo) => {
                return {
                    name: serviceInfo.name,
                    price: serviceInfo.price
                };
            })),
            date: data.reserva.date,
            time: data.reserva.time,
            payment_status: 'Pendiente'
        };

        // Enviar correo basado en si el usuario es nuevo o ya está registrado
        if (tempPassword) {
            // Nuevo usuario
            await mailService.sendRegistrationEmail(userEmail, tempPassword, citaData);
        } else {
            // Usuario ya registrado
            await mailService.sendConfirmation(userEmail, citaData);
        }
 
        return res.json({success: true});
    } catch (error) {
        return res.status(500).json({ message: 'Error al completar la cita', error: error });
    }
}


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
        await service.updateDate(id, body);
        return res.json({success: true});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getTotalAttendedSales = async (req, res) => {
    try {
        const totalIncome = await service.getTotalAttendedSales();
        res.json({ total: totalIncome });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el total de ventas atendidas' });
    }
};

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
    create, createSinPago, createSession, receiveComplete,  getTotalAttendedSales, get, getByTime, getById, getCounts,getByDate, getByUserId, update, _delete
};
