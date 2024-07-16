import { Sale } from "../db/models/sales.model.js";

class SalesService {

    constructor() { }

    async find(options) {
        const res = await Sale.findAll(options);
        return res;
    }

    async findOne(id) {
        const res = await Sale.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Sale.create(data);
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

export default SalesService;