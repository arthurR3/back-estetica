import UsersService from '../services/users.service.js';
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import ResetCodeService from '../services/codes.service.js';
import { jwt } from 'jsonwebtoken';

const codeService = new ResetCodeService();
const service = new UsersService();

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

  
const generateCode = () => {
    let randomNumber = Math.floor(Math.random() * 100000);
    return String(randomNumber).padStart(5, '0');
}
 
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

const sendEmail = async (email, resetCode) => {
    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Restablecimiento de contraseña',
        text: `Utiliza este codigo para restablecer tu contraseña: ${resetCode}. Este codigo Expira en 3 minutos`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log('Email enviado : ', info.response)
        }
    })
}

const sendCodeEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await service.findByEmail(email);
        console.log('User', user)
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
                console.log('Código existente válido. Código:', existingCode.resetCode);
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
            console.log('No existe ningún código existente. Generando nuevo código:', resetCode);
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
            return res.status(403).json({ success: false, message: 'No hay un codigo de restablecimiento asociado a este correo' })
        }
        {
            // Se verifica si es valido el codigo
            /* console.log(resetCode)
            console.log('Existing ', existingCode.resetCode)
            console.log('expiration ', existingCode.expirationTime)
            console.log(new Date(Date.now())) */
        }

        if (existingCode.resetCode === resetCode && existingCode.expirationTime > new Date(Date.now())) {
            return res.status(200).json({ success: true, message: 'El codigo de restablecimiento es correcto' })
        } else {
            // El codigo es incorrecto o ha expirado
            return res.status(403).json({ success: false, message: 'El codigo de restablecimiento es incorrecto o ha expirado' })
        }

    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await service.findByEmail(email);
        if (!response) {
            return res.status(401).json({ success: false, message: 'Correo electronico incorrecto!' })
        }

        if (blockedUsers[response.id]) {
            return res.status(403).json({ success: false, message: 'Excediste los limites de intento, espere un 1min para volver a intentarlo.' })
        }
        const isPassword = await bcrypt.compare(password, response.password)
        if (!isPassword) {
            response.numIntentos = (response.numIntentos || 0) + 1;
            console.log('No. ', response.numIntentos)
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
        const usuario ={
            idUser : response.id,
            nombre: response.name,
            lastName : response.last_name1,
            lastName2 : response.last_name2,
            email : response.email,

        }
        const token = jwt.sign({user:usuario}, secretKey , {expiresIn:'2h'})
        console.log('token ',token)
        res.json({ success: true, data: token})
    } catch (error) {
        res.status(500).send({ success: false, message: error.message })
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

        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await service.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo ya esta registrado' });
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const response = await service.create({ ...req.body, password: hashPassword });
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
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
        const response = await service.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, get, getById, update, _delete, login, sendCodeEmail, verificationEmail, updatePassword
};
