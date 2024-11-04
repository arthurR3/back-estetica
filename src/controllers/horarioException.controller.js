import HorarioExService from "../services/horarioException.service.js";

const horarioException = new HorarioExService();

const get = async (req, res) => {
    try {
        const response = await horarioException.find();
        return res.json(response);
    } catch (error){
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioException.findOne(id);
        return res.json(response);
    } catch (error){
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await horarioException.create(req.body);
        return res.json(response);
    } catch (error){
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioException.update(id, req.body);
        return res.json(response);
    } catch (error){
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await horarioException.delete(id);
        return res.json(response);
    } catch (error){
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    get, getById, create, update, _delete
};