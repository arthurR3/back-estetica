import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, login, sendConfirmationEmail,sendCodeEmail, verificationEmail, updatePassword, getSecretQuestion, verifySecretAnswer} from '../controllers/users.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .post('/login', login)
    .post('/recover-password', sendCodeEmail)
    .post('/confirmation-email', sendConfirmationEmail)
    .post('/verification-password', verificationEmail)
    .post('/verifcation-question', getSecretQuestion)
    .post('/verification-answer', verifySecretAnswer)
    .post('/change-password', updatePassword)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
