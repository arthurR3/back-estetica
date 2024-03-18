import { Router } from 'express'; 

import usersRouter from './users.router.js';
import productsRouter from './products.router.js'
import datesRouter from './dates.router.js'
import servicesRouter from './services.router.js'
import categoriesRouter from './categories.router.js'
import brandsRouter from './brands.router.js'
import suppliersRouter from './suppliers.router.js'

function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router); 
  router.use('/users', usersRouter);
  router.use('/products', productsRouter);
  router.use('/dates', datesRouter);
  router.use('/services', servicesRouter);
  router.use('/categories', categoriesRouter);
  router.use('/brands', brandsRouter);
  router.use('/suppliers', suppliersRouter);
}

export default routerApi;
