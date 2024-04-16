import { Date } from "../db/models/dates.model.js";
import { User } from "../db/models/users.model.js";
import { Payment } from "../db/models/payments.model.js";
import { Service } from "../db/models/services.model.js";
class DatesService {

    constructor() { }

    async find() {
        const res = await Date.findAll();
        return res;
    }
    async findOne(id){
        const res = await Date.findByPk(id);
        return res;
    }
    async findOneUser(userId) {
        const res = await Date.findOne({
            where: { id_user: userId },
            include: [
                {
                    model: User, // Modelo de usuario relacionado
                    attributes: ['name', 'last_name1','last_name2', 'phone','email'], // Atributos que se quiere obtener del usuario
                },
                {
                    model: Service, // Modelo de servicio relacionado
                    attributes: ['name', 'price'], // Atributos que se quiere obtener del servicio
                },
                {
                    model: Payment, // Modelo de método de pago relacionado
                    attributes: ['type'], // Atributos que se quiere obtener del método de pago
                },
            ],
        });
        if (!res) return [];

        return [res];
          }
    
    async findOneDate(id){
        const res = await Date.findOne({
            where: {
                id_user: id,
                payment_status: 'pendiente'
            }
        });
        c
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