import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, login, sendConfirmationEmail,sendCodeEmail, verificationEmail, updatePassword, getSecretQuestion, verifySecretAnswer, updatePassword2, getByCode} from '../controllers/users.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/code/:code', getByCode )
    .post('/', create )
    .post('/login', login)
    .post('/recover-password', sendCodeEmail)
    .post('/confirmation-email', sendConfirmationEmail)
    .post('/verification-password', verificationEmail)
    .post('/verifcation-question', getSecretQuestion)
    .post('/verification-answer', verifySecretAnswer)
    .post('/change-password', updatePassword)
    .post('/change-password/old/:id', updatePassword2)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
