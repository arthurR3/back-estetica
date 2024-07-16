import { Date } from "../db/models/dates.model.js";
import { User } from "../db/models/users.model.js";
import { Service } from "../db/models/services.model.js";

class DatesService {

    constructor() { }

    async find() {
        const res = await Date.findAll();
        return res;
    }

    async findByUserId(userId) {
        const res = await Date.findAll({
            where: {
                id_user: userId
            },
            include: [
                {
                    model : User,
                    attributes : ['name', 'last_name1','last_name1']
                },
                {
                    model: Service,
                    attributes: ['name', 'price']
                }
            ]
        });
        return res;
    }

    async findOne(id) {
        const res = await Date.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Date.create(data);
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

export default DatesService;