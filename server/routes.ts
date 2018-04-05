import * as express from 'express';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';

//For credentials
//import CredentialsCtrl from './controllers/credentials';

//For domains
//import DomainCtrl from './controllers/domain';

//For stocks
import StocksCtrl from './controllers/stocks';

import Cat from './models/cat';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();
  //const credentialsCtrl = new CredentialsCtrl();
  //const domainCtrl = new DomainCtrl();
  const stocksCtrl = new StocksCtrl();

  // Cats -- Unused
  router.route('/cats').post(catCtrl.getAll);
  router.route('/cats/count').post(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);
  
  // Credentials
  /*router.route('/credentials').post(credentialsCtrl.getAll);
  router.route('/credentials/count').post(credentialsCtrl.count);
  router.route('/credentials/insert').post(credentialsCtrl.insert);
  router.route('/credentials/get/:id').get(credentialsCtrl.get);
  router.route('/credentials/update/:id').put(credentialsCtrl.update);
  router.route('/credentials/delete/:id').delete(credentialsCtrl.delete);
  
  // Domains
  router.route('/domains').post(domainCtrl.getAll);
  router.route('/domains/count').post(domainCtrl.count);
  router.route('/domains/insert').post(domainCtrl.insert);
  router.route('/domains/get/:id').get(domainCtrl.get);
  router.route('/domains/delete/:id').delete(domainCtrl.delete);*/

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
