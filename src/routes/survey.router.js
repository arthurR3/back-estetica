import { Router } from "express";
const router = Router()
import { create, get, getById, update, _delete, getTotalUsers } from "../controllers/survey.controller.js";

router
  .get('/', get)
  .get('/:id', getById)
  .get('/total/survey', getTotalUsers)
  .post('/', create)
  .put('/:id', update)
  .delete('/:id', _delete);

  export default router