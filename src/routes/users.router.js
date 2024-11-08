import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, login, loginAdmin, sendConfirmationEmail,sendCodeEmail, verificationEmail, updatePassword, getSecretQuestion, verifySecretAnswer, updatePassword2, getByCode, getVerficateEmail} from '../controllers/users.controller.js';
import upload from '../config/multerConfig.js'
router
    .get('/', get )
    .get('/:id', getById )
    .get('/code/:code', getByCode )
    .post('/verificate', getVerficateEmail)
    .post('/', create )
    .post('/login', login)
    .post('/loginAdmin', loginAdmin)
    .post('/recover-password', sendCodeEmail)
    .post('/confirmation-email', sendConfirmationEmail)
    .post('/verification-password', verificationEmail)
    .post('/verifcation-question', getSecretQuestion)
    .post('/verification-answer', verifySecretAnswer)
    .post('/change-password', updatePassword)
    .post('/change-password/old/:id', updatePassword2)
    .put('/:id',upload, update)
    .delete('/:id', _delete );

export default router;
