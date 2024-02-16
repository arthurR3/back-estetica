// services/resetCode.service.js
import models from '../libs/sequelize.js';
import { ResetCode } from "../db/models/codes.model.js";

class ResetCodeService {
    constructor() { }

    async find() {
        const res = await ResetCode.findAll();
        return res;
    }

    async findOne(id) {
        const res = await ResetCode.findByPk(id);
        return res;
    }
    async create(data) {
        const res = await ResetCode.create(data);
        return res;
    }

    async updateByEmail(email, data) {
        const resetCode = await ResetCode.findOne({
            where: { userEmail: email },
        });
        if (!resetCode) {
            // Código de reinicio no encontrado para este correo electrónico
            return null;
        }
        const res = await resetCode.update(data);
        return res;
    }

    async findByEmail(email) {
        const res = await ResetCode.findOne({
            where: { userEmail: email },
        });
        return res;
    }
}

export default ResetCodeService;
