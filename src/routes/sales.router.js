import { Router } from 'express';
const router = Router(); 
import { get, getById, update, _delete,  simulatePayment, receiveComplete, createSession, getTotalDeliveredSales, createSessionMobile, confirmatePayment } from '../controllers/sales.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/total/total-attended', getTotalDeliveredSales)
    //.post('/', create )
    .post('/create-payement', createSessionMobile)
    .post('/confirmation-payment', confirmatePayment)
    .post('/createOrder', createSession)
    //.post('/webhook/:id', receiveWebhook)
    .post('/success', receiveComplete)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
