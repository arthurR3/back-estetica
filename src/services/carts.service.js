import { Cart } from "../db/models/carts.model.js";
import CartsDetailService from "./cartsDetail.service.js";
class CartsService {

    constructor() {
        this.cartsDetailService = new CartsDetailService();
     }

    async find() {
        const res = await Cart.findAll();
        return res;
    }

    async findOne(id) {
        const res = await Cart.findOne({
            where: {
                id_user: id,
                status: 'active'
            }
        });
        return res;
    }

    async create(data) {
        const res = await Cart.create(data);
        return res;
    }

    async update(id, data) {
        const model = await this.findOne(id);
        if (!model) {
            throw new Error(`Cart with id ${id} not found`);
        }
        const res = await model.update(data);
        return res;
    }


    async delete(userId) {
        // Primero, buscamos el carrito activo del usuario
        const cart = await this.findOne(userId);
        if (!cart) {
            throw new Error(`Cart for user with id ${userId} not found`);
        }

        // Obtenemos el ID del carrito
        const cartId = cart.id;

        // Luego, eliminamos los detalles del carrito
        const cartDetails = await this.cartsDetailService.findIdCart(cartId);
        for (const detail of cartDetails) {
            await this.cartsDetailService.delete(detail.id);
        }

        // Finalmente, eliminamos el carrito principal
        await cart.destroy();
        return { deleted: true };
    }

}

export default CartsService;