import { Category } from "../db/models/categories.model.js";

class CategoriesService {

    constructor() { }

    async find() {
        const res = await Category.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Category.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Category.create(data);
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

export default CategoriesService;