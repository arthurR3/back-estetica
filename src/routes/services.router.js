import { Router } from 'express';
import { get, getById, create, update, _delete } from '../controllers/services.controller.js';
import upload from '../config/multerConfig.js';
const router = Router(); 

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', upload, create )
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
