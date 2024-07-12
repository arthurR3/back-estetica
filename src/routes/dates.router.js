import { Router } from 'express';
const router = Router(); 
import { get, getById, create, update, _delete, createAppointment, AppointmentWebhook } from '../controllers/dates.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .post('/', create )
    .post('/createAppointment', createAppointment)
    .post('/reciveWebHook/:id', AppointmentWebhook)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
