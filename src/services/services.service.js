import { Service } from "../db/models/services.model.js";

class ServicesService {

    constructor() { }

    async find() {
        const res = await Service.findAll();
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