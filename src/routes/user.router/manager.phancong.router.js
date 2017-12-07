import { Router } from 'express';
import { usercontroller } from '../../controllers';

const route = new Router();
const controller= usercontroller.managerPhancong;

route.get('/list',controller._getPhanCong);

export default route;
