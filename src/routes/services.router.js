import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, getByName } from '../controllers/services.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/nom/:name', getByName )
    .post('/', create )
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
