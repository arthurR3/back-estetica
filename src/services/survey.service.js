import { Survey } from "../db/models/survey.model.js";

class SurveyServices {
    constructor() {}

    async find() {
        const res = await Survey.findAll()
        return res;
    }

    async findOne(id) {
        const res = await Survey.findByPk(id);
        return res;
    }
    async findById(id) {
        const res = await Survey.findByPk(id);
        return res;
    }
    
    async create(data) {
        const res = await Survey.create(data);
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

export default SurveyServices;