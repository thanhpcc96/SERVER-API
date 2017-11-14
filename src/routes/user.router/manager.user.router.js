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
  validate(validation.createUser),
  controller._postCreateUser
);
routes.post("/upload", upload.single("test"), controller.uploadPhotoProfile);

export default routes;
