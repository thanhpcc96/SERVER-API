import { Router } from 'express';
import validate from 'express-validation';
import { authJwt } from '../../services/auth.user';

import { usercontroller } from '../../controllers';

const route= new Router();

const managerChuyenxe= usercontroller.managerChuyenXe;
const validation= managerChuyenxe.validation;

route.get('/all',authJwt, managerChuyenxe.getAllChuyen);
route.get('/info/:id',authJwt, managerChuyenxe.getFullInfoChuyenID);

route.post('/info',authJwt,validate(validation.getFullInfoChuyen), managerChuyenxe.getFullInfoChuyen);

export default route;
