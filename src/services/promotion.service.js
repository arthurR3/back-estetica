import models from '../libs/sequelize.js';
import { Promotion } from "../db/models/promotion.model.js";
import { Product } from "../db/models/products.model.js";
import { Service } from "../db/models/services.model.js";

class PromotionService {
    constructor() {}

    async findAll() {
        const res = await Promotion.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Promotion.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Promotion.create(data);
        return res;
    }

    async update(id, data) {
        const res = await this.findOne(id);
        if (!res) {
            // Promoción no encontrada
            return null;
        }
        const updatedPromotion = await res.update(data);
        return updatedPromotion;
    }

    async delete(id) {
        const res = await this.findOne(id);
        if (!res) {
            // Promoción no encontrada
            return null;
        }
        await res.destroy();
        return { message: 'Promotion deleted' };
    }

    async findByProduct(id_product) {
        const res = await Promotion.findAll({
            where: { id_product },
            include: [
                {
                    model: Product,
                    attributes: ['name'], // Atributos que se quiere obtener
                }
            ]
        });
        return res;
    }

    async findByService(id_service) {
        const res = await Promotion.findAll({
            where: { id_service },
            include: [
                {
                    model: Service,
                    attributes: ['name'], // Atributos que se quiere obtener
                }
            ]
        });
        return res;
    }
}

export default PromotionService;
