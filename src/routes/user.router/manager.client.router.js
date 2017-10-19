import { Router } from "express"; /* eslint-disable */
import validate from "express-validation";

import { authJwt } from "../../services/auth.user";
import { usercontroller } from "../../controllers";

const route = new Router();
const controller = usercontroller.managerClient;
const validation = usercontroller.managerClient.validation;

/**
 * get list client
 */
route.get("/all", authJwt, controller._getAllClient);

/**
 * Delete list hoac tung client 1
 */
route.post(
  "/delete",
  authJwt,
  validate(validation.deleteClient),
  controller._deleteClient
);

/**
 * Get nhung danh sach ticket cua 1 khach hang!
 */
route.get(
  "/ticket-of/:idclient",
  authJwt,
  controller._getAllTicketPaymentOfClient
);

/**
 * PUT nap tien cho khach hang
 */
route.post(
  "/rechair",
  authJwt,
  validate(validation.rechairCoin),
  controller._putRechairCoin
);

export default route;
