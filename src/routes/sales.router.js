import { Router } from 'express';
const router = Router(); 
import { get, getById, update, _delete, createInMercadoPago, receiveWebhook } from '../controllers/sales.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    //.post('/', create )
    .post('/createOrder', createInMercadoPago)
    .post('/webhook', receiveWebhook)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
