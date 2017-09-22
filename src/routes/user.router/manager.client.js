import { Router } from 'express'; /* eslint-disable */
import { authJwt } from '../../services/auth.user';
import controller from '../../controllers/index'
const route = new Router();

route.get("/list", authJwt, controller.usercontroller.managerClient._getAllClient );


