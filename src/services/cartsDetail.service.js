import { CartDetail } from "../db/models/cartsDetail.model.js";

class CartsDetailService {

    constructor() { }

    async find() {
        const res = await CartDetail.findAll();
        return res;
    }

    async findOne(id) {
        const res = await CartDetail.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await CartDetail.create(data);
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

export default CartsDetailService;