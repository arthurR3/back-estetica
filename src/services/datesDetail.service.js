import { DateDetail } from "../db/models/datesDetail.model.js";

class DateDetailService {
    constructor() { }
    
    async find() {
        const res = await DateDetail.findAll();
        return res;
    }
    
    async findOne(id) {
        const res = await DateDetail.findByPk(id);
        return res;
    }
    
    async create(data) {
        const res = await DateDetail.create(data);
        return res;
    }  
    
    async update(id, data) {
        const res = await DateDetail.update(data, { where: { id } });
        return res;
    }
    async delete(id) {
        const model = await this.findOne(id);
        await model.destroy();
        return { deleted: true };
    }
}

export default DateDetailService;