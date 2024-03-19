import { Role } from "../db/models/roles.model.js";

class RolesService {

    constructor() { }

    async find() {
        const res = await Role.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Role.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Role.create(data);
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

export default RolesService;