import { Router } from 'express';
const router = Router(); 
import { get, getById, getByUserId ,create, update, _delete, createAppointment, AppointmentWebhook } from '../controllers/dates.controller.js';

router
    .get('/', get )
    .get('/:id', getById )
    .get('/user/:id', getByUserId )
    .post('/', create )
    .post('/createAppointment', createAppointment)
    .post('/reciveWebHook/:id', AppointmentWebhook)
    .put('/:id', update )
    .delete('/:id', _delete );

export default router;
