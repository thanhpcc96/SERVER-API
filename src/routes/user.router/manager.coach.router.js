import { Router } from 'express';
import validate from 'express-validation';

import { authJwt } from '../../services/auth.user';
import { usercontroller } from '../../controllers';

const managerCoach = usercontroller.managerCoach;
const validation = managerCoach.validation;

const route = new Router();

route.get('/all', authJwt, managerCoach.getAllCoach);
route.get('/info/:id', authJwt, managerCoach.getInfoCoach);

route.post(
  '/create',
  authJwt,
  validate(validation.createCoach),
  managerCoach.createCoach,
);

route.post(
  '/delete',
  authJwt,
  validate(validation.deleteCoach),
  managerCoach.deleteCoach,
);

route.post(
  '/update',
  authJwt,
  validate(validation.updateCoach),
  managerCoach.updateCoach,
);
route.post(
  '/phancong',
  authJwt,
  managerCoach._phanCong,
);

export default route;
