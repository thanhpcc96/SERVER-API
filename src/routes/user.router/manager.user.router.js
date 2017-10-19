import { Router } from "express";
import validate from "express-validation";

import { usercontroller } from "../../controllers";
import { authJwt } from "../../services/auth.user";
import { _uploadMiddleware } from "../../helper/upload";

const controller = usercontroller.managerUser;
const validation = controller.validation;

const routes = new Router();

/** get all user */

routes.get("/users", authJwt, controller._getAllUser);

/** Xoa tai khoan nhan vien */
routes.post(
  "/users/delete",
  authJwt,
  validate(validation.deleteUser),
  controller._deleteUser
);

/** Post tao tai khoan nhan vien moi */
routes.post(
  "/users",
  authJwt,
  _uploadMiddleware,
  validate(validation.createUser),
  controller._postCreateUser
);

export default routes;
