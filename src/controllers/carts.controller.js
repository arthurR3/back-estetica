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
                name: product.name, 
                description: product.description,
                image : product.image, 
                quantity: detail.amount,
                price: detail.unit_price,
                amout: product.amount,
            });
        }
        res.json({success: true, data: products});
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
}

const addProduct = async (req, res) => {
    try {
        const {id_user, id, price, quantity} = req.body;
        //Verifica si el carrito ya existe
        let cart = await cartService.findOne(id_user)
        if (!cart) {
            // Si no existe un carrito activo, crea uno nuevo
             cart = await cartService.create({
                id_user: id_user,
                status: 'active',
                date: new Date()
            });
        }
        const existingItem = await CartDetailService.findOneProduct(cart.dataValues.id, id)
        if(existingItem){
            existingItem.dataValues.amount += quantity
        }else{
            await CartDetailService.create({
                id_cart: cart.dataValues.id,
                id_product: id,
                amount: quantity,
                unit_price: price 
            });
        }

        res.status(201).json({message: 'Product added to cart successfully'})
    } catch (error) {
        res.status(500).json({message:'Error adding item to cart', error})
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
        const {id_user, id_product} = req.params;
        const{ quantity } = req.body
        const cart = await cartService.findOne(id_user)
        if(cart){
            const cartItem = await CartDetailService.findOneProduct(cart.dataValues.id, id_product)
            if(cartItem){
                cartItem.amount = quantity
                await cartItem.save()
                res.status(200).json({message: 'Product quantity updated successfully'})
            }else{
                res.status(404).json({message: 'Product not found in cart'})
            }
        }

       /*  const userId = req.params.id;
        const products = req.body;
        let idCart;
        console.log(products)
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
        for (const product of products) {
            const { id, quantify, price, amount } = product;
            // Verifica si el producto ya esta en el carrito
           
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
            
        } */
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
};

const removeProduct = async(req, res) =>{
    try {
        const {productId, id_user }= req.body
        const cart = await cartService.findOne(id_user)
        if(cart){
           const items=  await CartDetailService.findOneProduct(cart.dataValues.id, productId)
            await items.destroy({where: {id_cart: cart.dataValues.id, id_product: productId}})
            console.log('successfully deleted')
            res.status(200).json({message: 'Product deleted from cart successfully'})
        }else{
            res.status(404).json({message: 'Cart not found'})
        }
    } catch (error) {
        console.log('Error deleting product from cart', error)
        res.status(500).send({ success: false, message: error.message });
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
    create, addProduct, removeProduct, get, getById, update, _delete
};
