import { Router } from 'express';
import validate from 'express-validation';

import { authJwt } from '../../services/auth.user';
import { usercontroller } from '../../controllers';

const managerCoach = usercontroller.managerCoach;
const validation = managerCoach.validation;

const route = new Router();

route.get('/all', authJwt, managerCoach.getAllCoach);

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
  '/coach',
  authJwt,
  validate(validation.updateCoach),
  managerCoach.updateCoach,
);

export default route;
