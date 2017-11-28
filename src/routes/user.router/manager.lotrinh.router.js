import { Router } from 'express';
import validate from 'express-validation';
import { authJwt } from '../../services/auth.user';

import { usercontroller } from '../../controllers';

const route = new Router();

const managerTuyen = usercontroller.managerLotrinh;
const validation = managerTuyen.vaildation;

route.get('/all', authJwt, managerTuyen.getAllTuyen);

route.get('/info/:id', authJwt, managerTuyen.getinfoTuyen);
route.post(
  '/create',
  authJwt,
  validate(validation.creatTuyen),
  managerTuyen.creatTuyen,
);

route.post(
  '/update',
  authJwt,
  validate(validation.updateTuyen),
  managerTuyen.updateTuyen,
);

export default route;
