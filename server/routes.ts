import * as express from 'express';

import UserCtrl from './controllers/user';

//For stocks
import StocksCtrl from './controllers/stocks';

import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const userCtrl = new UserCtrl();
  const stocksCtrl = new StocksCtrl();

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Stocks
  router.route('/stocks').post(stocksCtrl.getAll);
  router.route('/stocks/count').post(stocksCtrl.count);
  router.route('/stocks/insert').post(stocksCtrl.insert);
  router.route('/stocks/get/:id').get(stocksCtrl.get);
  router.route('/stocks/getvalue/:id').get(stocksCtrl.getValue);
  router.route('/stocks/update/:id').put(stocksCtrl.update);
  router.route('/stocks/delete/:id').delete(stocksCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
