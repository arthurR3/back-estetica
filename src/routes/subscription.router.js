import { Router } from 'express';
const router = Router(); 
import {create, getKey, sendData, _deleteSubscription,subscribeUser, testToUser} from '../controllers/subscription.controller.js'

router
    .get('/', getKey)
    .post('/create', create )
    .post('/associate', subscribeUser)
    .post('/delete', _deleteSubscription)
    .post('/send-data', sendData)
    .post('/test', testToUser)

export default router;  