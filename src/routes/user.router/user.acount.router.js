import { Router } from "express";

import validate from "express-validation";
import { authJwt, authLocal } from "../../services/auth.user";
import { usercontroller } from "../../controllers";
import { vaildation } from "../../controllers/user.controller/manager/manager.lotrinh.constroller";

const route = new Router();

const controllers = usercontroller.acountController;
const validation = controllers.validation;

/**
   * Post vao login
   */
route.post(
  "/login",
  validate(validation.login),
  authLocal,
  controllers._postLogin
);
route.post("/forgot",controllers._postForgotPassword)
/**
   * Get lay thong tin info day du cua user
   */
route.get("/profile", authJwt, controllers._getUserInfo);

route.get("/checkjwt", authJwt, controllers._getCheckJWT);

/**
  * Post cap nhat thong tin ca nhan
  */
route.post(
  "/profile",
  authJwt,
  validate(validation.updateInfo),
  controllers._postUpdateInfo
);

/** Post update password */
route.post(
  "/profile/password",
  authJwt,
  validate(validation.updatePassWord),
  controllers._postUpdatePass
);

/** test create user */
route.post("/testcreate", controllers.testCreateUser);

export default route;
