import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete } from '../controllers/addresses.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .put('/:id/:email', update )
    .delete('/:id', _delete );

export default router;
