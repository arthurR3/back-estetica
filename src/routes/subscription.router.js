import { Router } from 'express';
const router = Router(); 
import {create, getKey, sendData} from '../controllers/subscription.controller.js'

router
    .get('/', getKey)
    .post('/create', create )
    .post('/send-data', sendData)

export default router;  