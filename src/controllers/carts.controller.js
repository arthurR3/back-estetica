import CartsService from "../services/carts.service.js";
import CartsDetailService from "../services/cartsDetail.service.js";
import ProductsService from "../services/products.service.js";
const cartService = new CartsService();
const CartDetailService = new CartsDetailService();
const ProductService = new ProductsService();
const get = async (req, res) => {
    try {
        const response = await cartService.find();
        return res.json(response);

    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await cartService.findOne(id);
        if(response === null){
            //console.log([])
            return res.json([]);
        }  
        let idCart = response.dataValues.id;
        const cartDetail = await CartDetailService.findIdCart(idCart);
        //console.log(cartDetail)
        const products = [];
        for (const detail of cartDetail){
            const product = await ProductService.findOne(detail.id_product);
            products.push({
                id: detail.id_product,
                name: product.name, // Asumiendo que el nombre del producto está en la propiedad 'name'
                description: product.description, // Asumiendo que la descripción del producto está en la propiedad 'description'
                image : product.image, 
                quantify: detail.amount,
                price: detail.unit_price,
                amout: product.amount,
            });
        }
        res.json({success: true, data: products});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

// NO LO NECESITO
const create = async (req, res) => {
    try {
        const response = await cartService.create(req.body);
        res.json({ success: true, data: response });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const update = async (req, res) => {
    try {
        const userId = req.params.id;
        const products = req.body;
        let idCart;
        //console.log(products.state)
        let cart = await cartService.findOne(userId);
        if (!cart) {
            // Si no existe un carrito activo, crea uno nuevo
            const newCart = await cartService.create({
                id_user: userId,
                status: 'active',
                date: new Date()
            });
            cart = newCart;
        }
        idCart = cart.dataValues.id;
        // Recorrer los productos recibidos desde el frontend
        for (const product of products.state) {
            const { id, quantify, price, amount } = product;
            // Verifica si el producto ya esta en el carrito
            /* if (quantify > amount) {
                return res.status(400).json({ success: false, message: 'La cantidad solicitada supera el stock disponible' });
            } */
            const cartDetail = await CartDetailService.findOneProduct(idCart, id);
            if (cartDetail != null) {
                // El producto ya está en el carrito, actualizar la cantidad y el precio unitario
                await CartDetailService.update(cartDetail.dataValues.id, {
                    amount: quantify
                });
            } else {
                // El producto no está en el carrito, insertar un nuevo detalle de carrito
                await CartDetailService.create({
                    id_cart: idCart,
                    id_product: id,
                    amount: quantify,
                    unit_price: price
                });
            }
            
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const updateCartItems = async (req, res) => {
    const {customerId, productId} = req.params
    const { cantidad } = req.body;
try {
    const cart = await cartService.findOne(customerId);
    if (!cart) {
        return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
    }

    const productIndex = cart.items.findIndex(item => item.id === productId);


} catch (error) {
    
}
}

// NO LO NECESITO

const _delete = async (req, res) => {
    try {
        const { id } = req.params;
        let cart = await cartService.findOne(id)
        const idCart = cart.dataValues.id;
        // Borrar todos los productos del carrito
        const cartDetail = await CartDetailService.findIdCart(idCart);

        //console.log(cartDetail)
        for (const detail of cartDetail) {
            await CartDetailService.delete(detail.dataValues.id);
        }

        const response = await cartService.delete(id);
        res.json(response);
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

export {
    create, get, getById, update, _delete
};
