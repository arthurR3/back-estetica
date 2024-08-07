import { Sale } from "../db/models/sales.model.js";
import { User } from "../db/models/users.model.js";
import { SaleDetail } from "../db/models/salesDetail.model.js";
import { Product } from "../db/models/products.model.js";
import { Category } from "../db/models/categories.model.js";
import { Brand } from "../db/models/brands.model.js";
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
                                attributes: ['id', 'id_category', 'id_brand', 'name', 'description', 'price'], // Atributos del producto
                                include:[
                                    {
                                        model: Category, // Información de la categoría
                                        attributes: [ 'id','name'] // Atributos de la categoría
                                    },
                                    {
                                        model: Brand, // Información de la categoría
                                        attributes: [ 'id','name'] // Atributos de la categoría
                                    }
                                ]
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
    async findByUserId(userId) {
        try {
            const sales = await Sale.findAll({
                where: {
                    id_user: userId
                },
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
                                attributes: ['id', 'id_category', 'id_brand', 'name', 'description', 'price'], // Atributos del producto
                                include: [
                                    {
                                        model: Category, // Información de la categoría
                                        attributes: ['id', 'name'] // Atributos de la categoría
                                    },
                                    {
                                        model: Brand, // Información de la marca
                                        attributes: ['id', 'name'] // Atributos de la marca
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
    
            return sales || []; // Devuelve el resultado o un array vacío si no hay resultados
        } catch (error) {
            console.error('Error al obtener las ventas por ID de usuario:', error);
            throw error;
        }
    }

    async getTotalDeliveredSales() {
        try {
            const totalIncome = await Sale.sum('total', {
                where: {
                    shipping_status: 'Entregado'
                }
            });

            return totalIncome || 0; // Devuelve 0 si no hay ingresos
        } catch (error) {
            console.error('Error al obtener el total de ventas entregadas:', error);
            throw error;
        }
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