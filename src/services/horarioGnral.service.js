import { HorarioG } from "../db/models/horarioGnral.model.js";


class HorarioGService {
    constructor() { }

    async find() {
        const res = await HorarioG.findAll();
        return res;
    }
    async findOne(id){
        const res = await HorarioG.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await HorarioG.create(data);
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

export default HorarioGService;