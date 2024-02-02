import UsersService from '../services/users.service.js';
import bcrypt from'bcrypt'
const service = new UsersService();
const saltRounds = 10;
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

const login = async (req, res)=> {
    try {
        const {email, password} = req.body;
        const response = await service.findByEmail(email); 
        console.log('res ',response.password)
        console.log('pass ',password)
        if(!response) {
            return res.status(401).json({success: false, message: 'Correo electronico incorrecto!'})
        }
        const isPassword = await bcrypt.compare(password, response.password)
        if(!isPassword){
            return res.status(401).json({ success: false ,message: 'Contraseña incorrecta'})
        }
        /* const token = jwt.sign({userId: user.id}, 'secret_key' , {expiresIn:'1h'}) */
        res.json({ success:true, data:response })
    } catch (error) {
       res.status(500).send({success: false, message:error.message}) 
    }
}

const create = async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await service.findByEmail(email);
        if(existingUser){
            return res.status(400).json({success: false, message:'El correo ya esta registrado'});
        }
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const response = await service.create({...req.body, password: hashPassword});
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
    create, get, getById, update, _delete, login
};
