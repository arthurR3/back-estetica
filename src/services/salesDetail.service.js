import { SaleDetail } from "../db/models/salesDetail.model.js";

class SalesDetailService {

    constructor() { }

    async find() {
        const res = await SaleDetail.findAll();
        return res;
    }

    async findOne(id) {
        const res = await SaleDetail.findByPk(id);
        return res;
    }

    async create(data, VentaID) {
        //const res = await SaleDetail.create(data);

        // Insertar los detalles de venta en la tabla DetalleVenta
        const details = data.map(producto => ({
            amount: producto.amount,
            unit_price: producto.unit_price,
            subtotal: producto.amount * producto.unit_price,
            id_sale: VentaID,
            id_product: producto.id
        }));
        const res = await SaleDetail.bulkCreate(details); //Realiza varias inserciones al mismo tiempo en una tabla.

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

export default SalesDetailService;