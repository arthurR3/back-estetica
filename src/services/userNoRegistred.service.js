import models from '../libs/sequelize.js';
import { UserNR } from '../db/models/usersNoRegistred.model.js';

class UsersNRService {
    constructor() { }

    async find() {
        const res = await UserNR.findAll();
        return res;
    }
    async findOne(id) {
        const res = await UserNR.findByPk(id);
        return res;
    }
    async findByEmail(email) {
        const res = await UserNR.findOne({ where: { email: email } });
        return res;
    }
    async create(data) {
        const res = await UserNR.create(data);
        return res;
    }
    async update(id, data) {
        const model = await this.findOne(id);
        const res = await model.update(data);
        return res;
    }
    async delete(id) {
        const model = await this.findOne(id);
        const res = await model.destroy();
        return res;
    }
}

export default UsersNRService;