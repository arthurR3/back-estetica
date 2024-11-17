import SurveyServices from '../services/survey.service.js'

const survey = new SurveyServices()

const get = async (req, res) => {
    try {
        const response = await survey.find()
        return response.json(response)
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await survey.findById(id)
        return response.json(response)
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const create = async (req, res) => {
    try {
        await survey.create(req.body)
        return res.status(200).send({success: true, message: 'Encuesta almacenada correctamente.'})
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await survey.update(id, req.body)
        return res.json(response);
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
      const response =   await survey.delete(id)
      return res.json(response);
    } catch (error) {
        res.status(500).send({success: false, message: error.message});
    }
}


export {get, getById, create, update, _delete}