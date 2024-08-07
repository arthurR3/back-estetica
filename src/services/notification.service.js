import nodemailer from 'nodemailer'

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        });
    }
    async sendEmail(mailOptions) {
        try {
            await this.transporter.sendMail(mailOptions)
            console.log('Email Enviado: ', mailOptions.to)
        } catch (error) {
            console.log('Error para enviar el correo: ', error)
        }
    }

    async sendConfirmation(email, citaData) {
        console.log(citaData.servicio)
        const servicesHtml = citaData.servicio.map(service => {
            return `<p><strong>Servicio:</strong> ${service.name}, Precio:$ ${service.price.toFixed(2)}</p>`;
        }).join('');
        const confirmationURL = `https://estetica-principal.netlify.app/confirmacion-cita?appointmentId=${citaData.idCita}&userID=${citaData.idUser}`;
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Confirmación de Cita',
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
                        .btn {
                            display: block;
                            width: 200px;
                            margin: 0 auto;
                            padding: 10px;
                            background-color: #4CAF50;
                            color: white;
                            text-align: center;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Confirmación de cita</h1>
                        <p>Estimado/a ${citaData.nombre},</p>
                        <p>Su cita para el ${citaData.date} a las ${citaData.time} ha sido <b>AGENDADA</b>.</p>
                        <div class="cita-info">
                            ${servicesHtml}
                            <p><strong>Dirección:</strong> Ubicación: Calle Velázquez Ibarra, Colonia Centro, Huejutla de Reyes Hidalgo</p>
                        </div>
                        <p>${citaData.payment_status === 'Pendiente' ? 'Deberá CONFIRMAR su cita en el siguiente enlace: (Vigencia: 2 horas antes de recibir la cita, de lo contrario, será CANCELADA) ' : ''} </p>
                        ${citaData.payment_status === 'Pendiente' ? `<a href="${confirmationURL}" class="btn">Confirmar Cita</a>` : ''}
                        <p>Gracias por elegirnos. Esperamos verlo/a pronto. ESTETICA PRINCIPAL EMMA</p>
                    </div>
                </body>
            </html>
        `,
        };
        await this.sendEmail(mailOptions)
    };

    async sendCancelEmail(email, citaData) {
        console.log(citaData.servicio)
        const servicesHtml = citaData.servicio.map(service => {
            return `<p><strong>Servicio:</strong> ${service.name}, Precio: ${service.price}</p>`;
        }).join('');
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Cancelación de Cita',
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
                        <h1>Cita Cancelada</h1>
                        <p>Estimado/a ${citaData.nombre},</p>
                        <p>Lamentamos informarle que su cita para el ${citaData.date} a las ${citaData.time} ha sido <b>CANCELADA</b> debido a que no fue confirmada.</p>
                        <div class="cita-info">
                            ${servicesHtml}
                            <p><strong>Dirección:</strong> Ubicación: Calle Velázquez Ibarra, Colonia Centro, Huejutla de Reyes Hidalgo</p>
                        </div>
                        <p>Si desea reprogramar su cita, por favor visite nuestro sitio web. ESTETICA PRINCIPAL</p>
                    </div>
                </body>
            </html>
        `,
        };
        await this.sendEmail(mailOptions);
    }

    async sendRegistrationEmail(email, tempPassword, citaData) {
        const servicesHtml = citaData.servicio.map(service => {
            return `<p><strong>Servicio:</strong> ${service.name}, Precio: ${service.price}</p>`;
        }).join('');
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Registro y Confirmación de Cita',
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
                        .btn {
                            display: block;
                            width: 200px;
                            margin: 0 auto;
                            padding: 10px;
                            background-color: #4CAF50;
                            color: white;
                            text-align: center;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Bienvenido/a a ESTETICA PRINCIPAL</h1>
                        <p>Estimado/a ${citaData.nombre},</p>
                        <p>Se ha creado una cuenta para usted en nuestro sistema. A continuación, encontrará sus credenciales temporales:</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Contraseña Temporal:</strong> ${tempPassword}</p>
                        <p>Por favor, ingrese a nuestro sitio web y cambie su contraseña lo antes posible.</p>
                        <p>Además, su cita para el ${citaData.date} a las ${citaData.time} ha sido <b>AGENDADA</b>.</p>
                        <div class="cita-info">
                            ${servicesHtml}
                            <p><strong>Dirección:</strong> Ubicación: Calle Velázquez Ibarra, Colonia Centro, Huejutla de Reyes Hidalgo</p>
                        </div>
                        <p>${citaData.payment_status === 'Pendiente' ? 'Deberá CONFIRMAR su cita en el siguiente enlace: ' : ''}</p>
                        ${citaData.payment_status === 'Pendiente' ? `<a href="${process.env.BASE_CONFIRMATION_URL}/confirmacion-cita/${citaData.confirmation_token}" class="btn">Confirmar Cita</a>` : ''}
                        <p>Gracias por elegirnos. Esperamos verlo/a pronto. ESTETICA PRINCIPAL</p>
                    </div>
                </body>
            </html>
        `,
        };
        await this.sendEmail(mailOptions);
    };

    async confirmationCompra(email, detailSales) {
        const { idSale, transactionAmount, productos } = detailSales;

        // Plantilla del correo electrónico
        const mailOptions = {
            from:  process.env.USER,
            to: email,
            subject: 'Confirmación de Compra',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="text-align: center;">¡Gracias por tu compra!</h2>
                <p>Estimado cliente,</p>
                <p>Tu pedido ha sido recibido y está en proceso. A continuación, encontrarás los detalles de tu compra:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Número de Pedido:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${idSale}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Fecha:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">Total:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">$${transactionAmount.toFixed(2)}</td>
                    </tr>
                </table>
                <h3>Detalles de la compra:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border: 1px solid #ddd;">Producto</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Cantidad</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productos.map(product => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #ddd;">${product.nombre}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                                <td style="padding: 10px; border: 1px solid #ddd;">$${(product.unit_amount / 100).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p>Si tienes alguna pregunta o necesitas más información, no dudes en <a href="https://estetica-principal.netlify.app/contact">contactarnos</a>.</p>
                <p>Gracias por comprar con nosotros.</p>
                <p>Saludos,<br>Estética Principal Emma!</p>
            </div>
        `
        };
        await this.sendEmail(mailOptions);
    }
}

export default MailService