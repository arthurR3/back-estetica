import { Cart } from "../db/models/carts.model.js";

class CartsService {

    constructor() { }

    async find() {
        const res = await Cart.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Cart.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Cart.create(data);
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

export default CartsService;