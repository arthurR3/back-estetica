import  models  from '../libs/sequelize.js';
import { Product } from '../db/models/products.model.js';

class ProductsService {

    constructor() { }

    async find() {
        const res = await Product.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Product.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Product.create(data);
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

export default ProductsService;