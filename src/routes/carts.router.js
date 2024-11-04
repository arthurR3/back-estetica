import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, addProduct, removeProduct } from '../controllers/carts.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .post('/add', addProduct)
    .put('/:id_user/:id_product', update )
    .delete('/removeProduct', removeProduct)
    .delete('/:id', _delete );

export default router;
