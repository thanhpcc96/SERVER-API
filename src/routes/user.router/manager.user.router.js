import { Router } from "express";
import validate from "express-validation";

import { usercontroller } from "../../controllers";
import { authJwt } from "../../services/auth.user";
import upload from "../../helper/upload";

const controller = usercontroller.managerUser;
const validation = controller.validation;

const routes = new Router();

/** get all user */

routes.get("/all", authJwt, controller._getAllUser);


/** get thong tin tai khoan user */

routes.get('/:id', authJwt, controller._getInfoUser)

/** Xoa tai khoan nhan vien */
routes.post(
  "/delete",
  authJwt,
  validate(validation.deleteUser),
  controller._deleteUser
);

/** Post tao tai khoan nhan vien moi */
routes.post(
  "/create",
  authJwt,
  validate(validation.createUser),
  controller._postCreateUser
);
routes.post("/upload", upload.any(), controller._uploadFile);

/** post update info */
routes.post('/update', authJwt,validate(validation.updateInfo) ,controller._postUpdateInfo);

export default routes;
