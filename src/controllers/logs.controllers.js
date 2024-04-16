import LogsServices from '../services/logs.services'

const logService = new LogsServices();

const get = async (req, res) => {
    try {
        const response = await logService.find();
        return res.json(response);
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }

}
const getById = async (req, res ) => {
    try {
        const { id } = req.params;
        const response = await logService.findOne(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await logService.create(req.body);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await logService.update(id, req.body);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
const _delete = (req, res) => {
    try {
        const { id } = req.params;
        const response = logService.delete(id);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, get, getById, update, _delete
};