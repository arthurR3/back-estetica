import { Date } from "../db/models/dates.model.js";

class DatesService {

    constructor() { }

    async find() {
        const res = await Date.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Date.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Date.create(data);
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

export default DatesService;