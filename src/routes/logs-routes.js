import { Router } from "express";

const router = Router()
import { get, getById, create, _delete } from '../controllers/logs.controllers.js'

router
    .get('/', get)
    .get('/:id', getById)
    .post('/', create)
    .delete('/:id', _delete);

export default router;