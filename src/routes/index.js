import { Router } from 'express'; 

import usersRouter from './users.router.js';
import productsRouter from './products.router.js'

function routerApi(app) {
  const router = Router();
  app.use('/api/v1', router); 
  router.use('/users', usersRouter);
  router.use('/products', productsRouter);
}

export default routerApi;
