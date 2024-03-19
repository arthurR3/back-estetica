import { Supplier } from "../db/models/suppliers.model.js";

class SuppliersService {

    constructor() { }

    async find() {
        const res = await Supplier.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Supplier.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Supplier.create(data);
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

export default SuppliersService;