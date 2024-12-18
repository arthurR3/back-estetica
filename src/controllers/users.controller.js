import UsersService from '../services/users.service.js';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import ResetCodeService from '../services/codes.service.js';
import LogsServices from '../services/logs.services.js';
import jwt from 'jsonwebtoken';
import AddressesService from '../services/addresses.service.js';
import ImageUploadService from '../services/imageUpload.service.js';
import DatesService from '../services/dates.service.js';
const uploadImage = new ImageUploadService();
const codeService = new ResetCodeService();
const service = new UsersService();
const addressService = new AddressesService();
const logService = new LogsServices();
const dateService = new DatesService();

let blockedUsers = {};
const saltRounds = 10;
const secretKey = process.env.SECRET_KEY
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

const generateUniqueCode = async () => {
    const codeExists = async (code) => {
        const user = await service.findByCode(code);
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

const generateCode = () => {
    let randomNumber = Math.floor(Math.random() * 100000);
    return String(randomNumber).padStart(5, '0');
}

const sendEmail = async (email, resetCode) => {
    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Verificación de Correo Electronico',
        text: `Por favor, para verificar tu correo electronico utiliza el siguiente codigo ${resetCode} . Este codigo Expira en 3 minutos.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email enviado : ', info.response)
        }
    })
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No se proporcionó un token' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token inválido' });
        }
        req.userId = decoded.userId;
        next();
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
        const response = await service.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getVerficateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await service.findByEmail(email);
        if (!user) {
            return res.json({ success: false, message: 'El correo no está registrado' });
        }
        return res.status(200).json({ success: true, message: 'El correo ya está registrado' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Ocurrió un error en el servidor' });
    }
};


const getByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const response = await service.findByCode(code);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const sendConfirmationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        let expirationTime; // Inicializar expirationTime aquí
        // Verificar si existe un código para el correo asociado
        const existingCode = await codeService.findByEmail(email);
        /* console.log('Existe ', existingCode); */

        if (existingCode) {
            if (existingCode.expirationTime > new Date()) {
                // El código es existente y aún no ha expirado
                //console.log('Código existente válido. Código:', existingCode.resetCode);
                await sendEmail(email, existingCode.resetCode);
                expirationTime = existingCode.expirationTime; // Asignar expirationTime aquí
            } else {
                // El código existente ha expirado,se genera uno nuevo y actualizar la base de datos

                const resetCode = generateCode();
                expirationTime = new Date(Date.now() + 3 * 60 * 1000); // Asignar expirationTime aquí

                /* console.log('Expirara en ', expirationTime) */
                /* console.log('Código existente expirado. Generando nuevo código:', resetCode); */

                await codeService.updateByEmail(email, { resetCode, expirationTime });
                await sendEmail(email, resetCode);
            }
        } else {
            // Generar código de verificación y tiempo de expiración
            const resetCode = generateCode();
            expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 minutos de expiración

            // Guardar el código de verificación en la tabla codeService
            await codeService.create({ userEmail: email, resetCode, expirationTime });
            // Enviar correo de confirmación con el código de verificación
            await sendEmail(email, resetCode);
        }
        res.json({ success: true, message: 'Se ha enviado el código de verificación al correo' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const sendCodeEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await service.findByEmail(email);
        // console.log('User', user)
        if (!user) {
            return res.status(402).json({ success: false, message: 'El correo no está registrado' });
        }

        let expirationTime; // Inicializar expirationTime aquí

        // Verificar si existe un código para el correo asociado
        const existingCode = await codeService.findByEmail(email);
        /* console.log('Existe ', existingCode); */

        if (existingCode) {
            if (existingCode.expirationTime > new Date()) {
                // El código es existente y aún no ha expirado
                // console.log('Código existente válido. Código:', existingCode.resetCode);
                await sendEmail(email, existingCode.resetCode);
                expirationTime = existingCode.expirationTime; // Asignar expirationTime aquí
            } else {
                // El código existente ha expirado,se genera uno nuevo y actualizar la base de datos

                const resetCode = generateCode();
                expirationTime = new Date(Date.now() + 3 * 60 * 1000); // Asignar expirationTime aquí

                /* console.log('Expirara en ', expirationTime) */
                /* console.log('Código existente expirado. Generando nuevo código:', resetCode); */

                await codeService.updateByEmail(email, { resetCode, expirationTime });
                await sendEmail(email, resetCode);
            }
        } else {
            // No existe un código para este correo electrónico, generar uno nuevo y crear un registro en la base de datos
            const resetCode = generateCode();
            //  console.log('No existe ningún código existente. Generando nuevo código:', resetCode);
            expirationTime = new Date(Date.now() + 3 * 60 * 1000); // Asignar expirationTime aquí

            await codeService.create({ userEmail: user.email, resetCode, expirationTime });
            await sendEmail(email, resetCode);
        }
        res.json({ success: true, message: 'Se ha enviado el correo para restablecer la contraseña' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const verificationEmail = async (req, res) => {
    try {
        const { email, resetCode } = req.body;
        // Se busca si existe un correo en la base de datos de ResetCode
        const existingCode = await codeService.findByEmail(email);
        if (!existingCode) {
            return res.status(403).json({ success: false, message: 'No hay un codigo de verificación asociado a este correo' })
        }
        if (existingCode.resetCode === resetCode && existingCode.expirationTime > new Date(Date.now())) {
            return res.status(200).json({ success: true, message: 'El codigo es correcto' })
        } else {
            // El codigo es incorrecto o ha expirado
            return res.status(403).json({ success: false, message: 'El codigo de verificación es incorrecto o ha expirado' })
        }

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

// Consulta la pregunta secreta asociada al correo electrónico del usuario
export const getSecretQuestion = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await service.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ success: true, question: user.question });
    } catch (error) {
        console.error('Error al obtener la pregunta secreta:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// Verifica si la respuesta proporcionada por el usuario es correcta
export const verifySecretAnswer = async (req, res) => {
    try {
        const { email, answer } = req.body;
        const user = await service.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (user.answers !== answer) {
            return res.status(400).json({ success: false, message: 'Respuesta incorrecta' });
        }

        return res.status(200).json({ success: true, message: 'Respuesta correcta' });
    } catch (error) {
        console.error('Error al verificar la respuesta secreta:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let showSurvey= false;
        const response = await service.findByEmail(email);
        if (!response) {
            return res.status(401).json({ success: false, message: 'Correo electronico incorrecto!' })
        }

        if (blockedUsers[response.id]) {
            await logService.logLoginBlock(req.ip, email)
            return res.status(403).json({ success: false, message: 'Excediste los limites de intento, espere un 1min para volver a intentarlo.' })
        }
        const isPassword = await bcrypt.compare(password, response.password)
        if (!isPassword) {
            response.numIntentos = (response.numIntentos || 0) + 1;
            //   console.log('No. ', response.numIntentos)
            if (response.numIntentos === 3) {
                blockedUsers[response.id] = true;
                setTimeout(() => {
                    delete blockedUsers[response.id]
                    response.numIntentos = 0;
                    service.update(response.id, { numIntentos: response.numIntentos })
                }, 60000)
            } else {
                await service.update(response.id, { numIntentos: response.numIntentos })
            }
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' })
        }

        if (response.id_role !== 1) {
            return res.status(403).json({ success: false, message: 'Por favor, inicie sesión a través del portal de administración.' });
        }

        const hasDates = await dateService.findByUserId(response.id);
        console.log('hasdate', hasDates)
        if(hasDates.length > 0){
            if(response.complete_survey === false){
                showSurvey = true
            }else{
                showSurvey = false
            }
        }else{
            showSurvey = false
        }
        console.log(showSurvey)
        const usuario = {
            idUser: response.id,
            nombre: response.name,
            email:email,
            lastName: response.last_name1,
            lastName2: response.last_name2,
            rol: response.id_role,
            code: response.code,
            showSurvey: showSurvey
        }
        const token = jwt.sign({ user: usuario }, secretKey, { expiresIn: '2h' })
        await logService.logLogin(req.ip, email)
        res.json({ success: true, data: token })
    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
}


const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await service.findByEmail(email);
        if (!response) {
            return res.status(401).json({ success: false, message: 'Correo electrónico incorrecto!' });
        }

        // Verificar que el rol sea de administrador
        if (response.id_role !== 2) { // Suponiendo que 2 es el rol de administrador
            return res.status(403).json({ success: false, message: 'Acceso denegado. No tienes permisos de administrador.' });
        }

        const isPassword = await bcrypt.compare(password, response.password);
        if (!isPassword) {
            response.numIntentos = (response.numIntentos || 0) + 1;
            if (response.numIntentos === 3) {
                blockedUsers[response.id] = true;
                setTimeout(() => {
                    delete blockedUsers[response.id];
                    response.numIntentos = 0;
                    service.update(response.id, { numIntentos: response.numIntentos });
                }, 60000);
            } else {
                await service.update(response.id, { numIntentos: response.numIntentos });
            }
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const admin = {
            idUser: response.id,
            nombre: response.name,
            lastName: response.last_name1,
            lastName2: response.last_name2,
            rol: response.id_role,
            code: response.code,
        };

        const token = jwt.sign({ user: admin }, secretKey, { expiresIn: '2h' });
        await logService.logLogin(req.ip, email);
        res.json({ success: true, data: token });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};



const updatePassword2 = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;
        const user = await service.findOne(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        const isPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isPassword) {
            return res.status(400).json({ success: false, message: 'La contraseña Anterior no es correcta!, Intente de Nuevo' });
        }
        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        await service.update(user.id, { password: hashPassword });
        await logService.logSensitiveDataUpdate(req.ip, user.email, ' Actualizó su contraseña correctamente')
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await service.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const hashPassword = await bcrypt.hash(newPassword, saltRounds);
        await service.update(user.id, { password: hashPassword });
        await logService.logSensitiveDataUpdate(req.ip, email, ' Restableció su contraseña')
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const { user, address } = req.body;
        const { email, password } = user;
        //console.log(email, password);
        const existingUser = await service.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo ya esta registrado' });
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const code = await generateUniqueCode();
        const userData = {
            id_role: user.id_role,
            id_frequency: user.id_frequency,
            name: user.name,
            last_name1: user.last_name1,
            last_name2: user.last_name2,
            email: user.email,
            password: hashPassword,
            phone: user.phone,
            birthday: user.birthday,
            ...(user.question && { question: user.question }),  
            ...(user.answers && { answers: user.answers }),
            code: code,
        };
        await service.create(userData);
        /* const id_user = response.id;
        await addressService.create({
            id_user : id_user,
            municipality: address.municipality,
            cologne: address.cologne,
            street: address.street,
            cp: address.cp,
        }) */
        await logService.logSensitiveDataUpdate(req.ip, email, 'Registró un nuevo usuario')
        res.json({ success: true, message: 'Registrado Correctamente' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        if (req.file) {
            const file = req.file;
            const format = ['image/png', 'image/jpg', 'image/jpeg'];
            if (!format.includes(file.mimetype)) {
                return res.status(400).json({ success: false, message: 'Solo se permiten archivos con formato png, jpg y jpeg' })
            }
            const imageURL = await uploadImage.uploadImage(file.path, 'Image_Estetica');
            body.image = imageURL;
        }
        const response = await service.update(id, body);
        await logService.logSensitiveDataUpdate(req.ip, response.dataValues.email, 'Actualizó su información personal')
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
    create, get, getById, getVerficateEmail, getByCode, update, _delete, login, loginAdmin, sendConfirmationEmail, sendCodeEmail, verificationEmail, updatePassword, updatePassword2
};
