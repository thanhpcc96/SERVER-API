import { Router } from 'express';
import validate from 'express-validation';

import { authJwt } from '../../services/auth.client';
import { interactClientController } from '../../controllers';

const validation = interactClientController.validation;
const route = new Router();
// get list ve con kha dung cua chuyen xe
route.get('/tickets', authJwt, interactClientController._getAvaiableTicket);

// get thong tin ve day dung
route.get(
  '/ticket/:idve',
  authJwt,
  validate(validation.getinfove),
  interactClientController.getInfoTicket,
);

// router get thong tin lich su giao dich
route.get('/history', authJwt, interactClientController._getHistoryTransction);


// route put noi dung comment
route.post(
  '/comment',
  authJwt,
  validate(validation.putComment),
  interactClientController._putComment,
);
export default route;
