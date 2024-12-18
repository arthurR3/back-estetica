import SurveyServices from '../services/survey.service.js'
import UsersService from '../services/users.service.js'

const survey = new SurveyServices()
const user = new UsersService()

const get = async (req, res) => {
    try {
        const response = await survey.find()
        return res.status(200).send({success:true, data: response})
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getTotalUsers = async (req, res) => {
    try {
        const users = await survey.getTotalUsers()
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await survey.findById(id);
        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


const create = async (req, res) => {
    try {
        await survey.create(req.body)
        await user.update(req.body.id_user, {complete_survey:true})
        return res.status(200).send({success: true, message: 'Encuesta almacenada correctamente.'})
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await survey.update(id, req.body);
        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await survey.delete(id);
        return res.status(200).json({ success: true, message: "Encuesta eliminada", data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};


export {get, getById, getTotalUsers, create, update, _delete}