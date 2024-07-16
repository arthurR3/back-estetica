import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, getByUserId } from '../controllers/dates.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/user/:id', getByUserId )
    .post('/', create )
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
