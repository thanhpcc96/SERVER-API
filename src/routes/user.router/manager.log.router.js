import { Router } from 'express';
import { authJwt } from '../../services/auth.user';
import { usercontroller } from '../../controllers';

const route = new Router();
const logController = usercontroller.managerLog;

route.get('/all', authJwt, logController._getLog);

export default route;
