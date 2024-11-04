import { Router } from 'express';
import { getSalesView } from '../controllers/sales_view.controller.js';

const router = Router();

router.get('/', getSalesView);

export default router;