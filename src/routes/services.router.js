import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, getByName } from '../controllers/services.controller.js';
import upload from '../config/multerConfig.js';
router
    .get('/', get )
    .get('/:id', getById )
    .get('/nom/:name', getByName )
    .post('/', upload, create )
    .put('/:id', upload, update )
    .delete('/:id', _delete );

export default router;
