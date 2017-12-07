import { Router } from 'express';
import {
  _getClientSeeds,
  _deleteAllClient,
  _generateChuyenSeed,
  _deleteAllChuyen,
  _generateChuyenInDay,
  getUserSeeds,
  _generratePhanCong,
} from '../controllers';

const routes = new Router();

routes.get('/client/count?', _getClientSeeds);
routes.get('/client/delete_all', _deleteAllClient);
routes.get('/generatechuyen', _generateChuyenSeed);
routes.get('/deletechuyen', _deleteAllChuyen);
routes.get('/generate_one', _generateChuyenInDay);
routes.get('/user/:role', getUserSeeds);
routes.get('/phancong', _generratePhanCong);

export default routes;
