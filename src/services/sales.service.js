import { Sale } from "../db/models/sales.model.js";
import { User } from "../db/models/users.model.js";
import { SaleDetail } from "../db/models/salesDetail.model.js";
import { Product } from "../db/models/products.model.js";
class SalesService {

    constructor() { }

    async find() {
        try {
            const sales = await Sale.findAll({
                include: [
                    {
                        model: User, // Información del usuario
                        attributes: ['id', 'name', 'last_name1', 'last_name2', 'phone', 'email'] // Atributos del usuario
                    },
                    {
                        model: SaleDetail, // Detalles de la venta
                        attributes: ['id', 'amount', 'unit_price', 'subtotal'], // Atributos del detalle
                        include: [
                            {
                                model: Product, // Información del producto
                                attributes: ['id', 'name', 'description', 'price'] // Atributos del producto
                            }
                        ]
                    }
                ]
            });

            return sales || []; // Devuelve el resultado o un array vacío si no hay resultados
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
            throw error;
        }
    }

    async findOne(id) {
        const res = await Sale.findByPk(id);
        return res;
    }

    async create(data) {
        const res = await Sale.create(data);
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

export default SalesService;