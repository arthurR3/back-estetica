import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete } from '../controllers/products.controller.js';
import upload from '../config/multerConfig.js'
router
    .get('/', get )
    .get('/:id', getById )
    .post('/',upload, create )
    .put('/:id', upload, update )
    .delete('/:id', _delete );

export default router;
