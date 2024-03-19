import { Frequency } from "../db/models/frequencies.model.js";

class FrequenciesService {

    constructor() { }

    async find() {
        const res = await Frequency.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Frequency.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Frequency.create(data);
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

export default FrequenciesService;