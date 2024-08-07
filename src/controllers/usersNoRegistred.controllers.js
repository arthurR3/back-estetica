import UsersNRService from "../services/userNoRegistred.service.js";
const service = new UsersNRService();
const get = async(req, res) => {
    try {
        const response = await service.find();
        return res.json(response);  
    } catch (err) {
        res.status(500).send({ success: false, message: err.message });
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
        const { email, password } = req.body;
        const existingUser = await service.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El correo ya esta registrado' });
        }
        const response = await service.create({ ...req.body});
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
    create, get, getById ,update, _delete
}