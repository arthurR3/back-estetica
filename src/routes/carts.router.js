import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete } from '../controllers/carts.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .put('/updateCart/:id', update )
    .delete('/:id', _delete );

export default router;
