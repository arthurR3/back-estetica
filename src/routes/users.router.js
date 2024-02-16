import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, login, sendCodeEmail, verificationEmail } from '../controllers/users.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .post('/login', login)
    .post('/recover-password', sendCodeEmail)
    .post('/verification-password', verificationEmail)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
