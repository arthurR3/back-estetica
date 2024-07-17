import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, getByName } from '../controllers/payments.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/nom/:type', getByName )
    .post('/', create )
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
