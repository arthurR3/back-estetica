import { Category } from '../db/models/categories.model.js';
import { Service } from "../db/models/services.model.js";

class ServicesService {

    constructor() { }

    async find() {
        const res = await Service.findAll({
            include: [
                {
                    model: Category, // Modelo relacionado
                    attributes: ['name'], // Atributos que se quiere obtener
                },
            ],
        });
        return res;
    }

    async findByName(name) {
        const res = await Service.findAll({
            where: {
                name: name
            },
        });
        return res;
    }
    async findById(id) {
        const res = await Service.findAll({
            where: {
                id: id
            },
        });
        return res;
    }

    async findOne(id) {
        const res = await Service.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Service.create(data);
        return res;
    }

    async update(id, data) {
        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;
    }

    async delete(id) {
        const model = await this.findOne(id);
        await model.destroy();
        return { deleted: true };
    }

}

export default ServicesService;