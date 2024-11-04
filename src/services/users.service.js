import models from '../libs/sequelize.js';
import { User } from '../db/models/users.model.js';

class UsersService {

    constructor() { }

    async find() {
        const res = await User.findAll();
        return res;
    }

    async findOne(id) {
        const res = await User.findByPk(id);
        return res;
    }

    async findByEmail(email) {
        const res = await User.findOne({
            where: {
                email: email,
            },
        });
        return res;
    }
    

    async findByCode(code) {
        const res = await User.findOne({
            where: {
                code: code,
            },
        });
        return res;
    }

    async create(data) {
        const res = await User.create(data);
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

export default UsersService;