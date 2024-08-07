import { Router } from 'express';
const router = Router(); 
import { get, getById, getByUserId, getCounts, getByDate,create, update, _delete, createAppointment, AppointmentWebhook, getByTime, createSinPago, confirmAppointment, getTotalAttendedSales } from '../controllers/dates.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/user/:id', getByUserId )
    .get('/mas/date', getByDate )
    .get('/counts/status', getCounts)
    .post('/counts/times', getByTime)
    .get('/total/total-attended', getTotalAttendedSales)
    .post('/', create )
    .post('/create-sinpay', createSinPago)
    .post('/createAppointment', createAppointment)
    .post('/confirmation', confirmAppointment)
    .post('/reciveWebHook/:id', AppointmentWebhook)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
