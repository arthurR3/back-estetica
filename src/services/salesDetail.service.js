import { SaleDetail } from "../db/models/salesDetail.model.js";
import ProductsService from "./products.service.js";
const productService = new ProductsService()
class SalesDetailService {

    constructor() { }

    async find(options) {
        const res = await SaleDetail.findAll(options);
        return res;
    }

    async findOne(id) {
        const res = await SaleDetail.findByPk(id);
        return res;
    }

    async create(data, VentaID) {
        //const res = await SaleDetail.create(data);
        console.log(data)
        // Insertar los detalles de venta en la tabla DetalleVenta
        const details = data.map(producto => ({
            id_sale: VentaID,
            id_product: producto.id,
            amount: producto.quantity,
            unit_price: producto.unit_amount/100,
            subtotal: producto.quantity * (producto.unit_amount/100),
        }));
        const res = await SaleDetail.bulkCreate(details); //Realiza varias inserciones al mismo tiempo en una tabla.
        for (const producto of data) {
            const product = await productService.findOne(producto.id); 
            const newStock = product.amount - producto.quantity;
            await productService.update(producto.id, { amount: newStock }); 
        }
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