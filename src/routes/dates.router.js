import { Router } from 'express';
const router = Router(); 
import { get, getById, getByUserId, getCounts, getByDate,create, update, _delete, createAppointment, AppointmentWebhook, getByTime } from '../controllers/dates.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/user/:id', getByUserId )
    .get('/mas/date', getByDate )
    .get('/counts/status', getCounts)
    .post('/counts/times', getByTime)
    .post('/', create )
    .post('/createAppointment', createAppointment)
    .post('/reciveWebHook/:id', AppointmentWebhook)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
