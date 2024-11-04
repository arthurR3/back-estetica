import { Router } from 'express'; 

import usersRouter from './users.router.js';
import userNRouter from './userNoRegistred.router.js'
import productsRouter from './products.router.js'
import datesRouter from './dates.router.js'
import servicesRouter from './services.router.js'
import rolesRouter from './roles.router.js'
import frequenciesRouter from './frequencies.router.js'
import brandsRouter from './brands.router.js'
import categoriesRouter from './categories.router.js'
import suppliersRouter from './suppliers.router.js'
import paymentsRouter from './payments.router.js'
import addressesRouter from './addresses.router.js'
import salesRouter from './sales.router.js'
import salesDetailRouter from './salesDetail.router.js'
import cartsRouter from './carts.router.js'
import cartsDetailRouter from './cartsDetail.router.js'
import DatesDetailRouter from './datesDetail.router.js'
import PromotionRouter from './promotion.router.js'
import HorarioGnralRouter from './horarioGnral.router.js'
import HorarioEXPRouter from './horarioException.router.js'

import salesViewRouter from './sales_view.router.js'; 

function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router); 
  router.use('/users', usersRouter);
  router.use('/usersNR', userNRouter)
  router.use('/products', productsRouter);
  router.use('/dates', datesRouter);
  router.use('/datesDetail', DatesDetailRouter);
  router.use('/services', servicesRouter);
  router.use('/roles', rolesRouter);
  router.use('/frequencies', frequenciesRouter);
  router.use('/brands', brandsRouter);
  router.use('/categories', categoriesRouter);
  router.use('/suppliers', suppliersRouter);
  router.use('/payments', paymentsRouter);
  router.use('/address', addressesRouter);
  router.use('/sales', salesRouter);
  router.use('/salesDetail', salesDetailRouter);
  router.use('/carts', cartsRouter);
  router.use('/cartsDetail', cartsDetailRouter);
  router.use('/promotion', PromotionRouter);
  router.use('/horarioGnral', HorarioGnralRouter);
  router.use('/horarioEXP', HorarioEXPRouter);

  router.use('/salesView', salesViewRouter);

}

export default routerApi;
