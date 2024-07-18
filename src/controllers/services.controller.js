import ServicesService from "../services/services.service.js";
import ImageUploadService from "../services/imageUpload.service.js";
import upload from "../config/multerConfig.js";
const service = new ServicesService();
const uploadImage = new ImageUploadService();

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

const getByName = async (req, res) => {
    try {
        const { name } = req.params;
        const response = await service.findByName(name);
        return res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const create = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ success: false, message: 'No se ha subido ningún archivo' });
    }
    try {
        const format = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!format.includes(file.mimetype)) {
            return res.status(400).json({ success: false, message: 'Solo se permiten archivos con formato png, jpg y jpeg' })
        }
        const imageURL = await uploadImage.uploadImage(file.path, 'Image_Estetica');
        req.body.image = imageURL;
        const response = await service.create(req.body);
        res.json({ success: true, data: response });
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
    create, get, getById, update, _delete, getByName
};
