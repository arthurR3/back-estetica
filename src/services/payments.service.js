import { Payment } from "../db/models/payments.model.js";

class PaymentsService {

    constructor() { }

    async find() {
        const res = await Payment.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Payment.findByPk(id);
        return res;
    }
    async findByName(payment){
        const res = await Payment.findOne({
            where: {
                tipo: payment
            }
        });
        return res;
    }

    async create(data) {
        const res = await Payment.create(data);
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

export default PaymentsService;