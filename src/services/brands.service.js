import { Brand } from "../db/models/brands.model.js";

class BrandsService {

    constructor() { }

    async find() {
        const res = await Brand.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Brand.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Brand.create(data);
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

export default BrandsService;