import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete } from '../controllers/roles.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
