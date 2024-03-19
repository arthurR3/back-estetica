import models from '../libs/sequelize.js';
import { Product } from '../db/models/products.model.js';
import { Category } from '../db/models/categories.model.js';
import { Brand } from '../db/models/brands.model.js';

class ProductsService {

    constructor() { }

    async find() {
        const res = await Product.findAll({
            include: [
                {
                    model: Category, // Modelo relacionado
                    attributes: ['name'], // Atributos que se quiere obtener
                },
                {
                    model: Brand, // Modelo relacionado
                    attributes: ['name'], // Atributos que se quiere obtener
                },
            ],
        });
        return res;
    }

    async findOne(id) {
        const res = await Product.findByPk(id, {
            include: [
                {
                    model: Category, // Modelo relacionado
                    attributes: ['name'], // Atributos que se quiere obtener
                },
                {
                    model: Brand, // Modelo relacionado
                    attributes: ['name'], // Atributos que se quiere obtener
                },
            ],
        });
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