import { Address } from "../db/models/addresses.model.js";

class AddressesService {

    constructor() { }

    async find() {
        const res = await Address.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Address.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Address.create(data);
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

export default AddressesService;