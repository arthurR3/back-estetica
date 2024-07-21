import DateDetailService from "../services/datesDetail.service.js";

const dateDetailService = new DateDetailService();

const get = async (req, res) => {
    try {
        const response = await dateDetailService.find();
        return res.json(response);
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params
        const response = await dateDetailService.findOne(id);
        return res.json(response);
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    try {
        const response = await dateDetailService.create(req.body);
        res.json({ success: true, data: response });
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const response = await dateDetailService.update(id, body);
        res.json({ success: true, data: response });
        
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await dateDetailService.delete(id);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export { get, getById, create, update, _delete } 