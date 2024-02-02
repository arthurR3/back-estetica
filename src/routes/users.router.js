import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, login } from '../controllers/users.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .post('/login', login)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
