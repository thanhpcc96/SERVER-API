import { Router } from 'express';
import validate from 'express-validation';
import { authJwt } from '../../services/auth.user';

import { usercontroller } from '../../controllers';

const route = new Router();

const managerTicket = usercontroller.managerTicket;
const validation = managerTicket.validation;

route.post(
  '/info',
  authJwt,
  validate(validation.getTicketInfo),
  managerTicket.getTicketInfo,
);

route.get('/all', authJwt, managerTicket.getAllTicket);

route.post(
  '/xeve',
  authJwt,
  validate(validation.tickXeVe),
  managerTicket.tickXeVe,
);

export default route;
