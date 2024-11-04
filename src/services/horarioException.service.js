import { HorarioEXP } from "../db/models/horarioException.model.js";

class HorarioExService {
    constructor() { }

    async find() {
        const res = await HorarioEXP.findAll();
        return res;
    }
    async findOne(id){
        const res = await HorarioEXP.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await HorarioEXP.create(data);
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
    }
}

export default HorarioExService;