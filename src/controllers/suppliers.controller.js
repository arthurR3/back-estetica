import SuppliersService from "../services/suppliers.service.js";
const supplier = new SuppliersService();

const get = async (req, res) => {
    try {
        const response = await supplier.find();
        return res.json(response);

    } catch (error) { 
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await supplier.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await supplier.create(req.body);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await supplier.update(id, body);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await supplier.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, get, getById, update, _delete
};
