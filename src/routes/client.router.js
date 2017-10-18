import { Router } from "express";
import validate from "express-validation";

import { authLocal, authJwt } from "../services/auth.client";
import { clientControler } from "../controllers";

const route = new Router();

const validation = clientControler.acountClientController.validation;

route.post(
  "/register",
  validate(validation.resgiter),
  clientControler.acountClientController._postRegister
);

route.post(
  "/login",
  validate(validation.login),
  authLocal,
  clientControler.acountClientController._postLogin
);
/*
 _resetPassword
 */
route.post(
  "/forgot",
  validate(validation.resetpassword),
  clientControler.acountClientController._postResetPassword
);

route.get("/all", clientControler.acountClientController._getAll);

route.get("/profile", authJwt, clientControler.acountClientController._getInfo);

route.post(
  "/profile",
  authJwt,
  validate(validation.updateInfo),
  clientControler.acountClientController._postUpdateInfo
);

route.post(
  "/profile/password",
  authJwt,
  validate(validation.updatePassWord),
  clientControler.acountClientController._postUpdatePassword
);

//route.post('/reset/:token',ClientController._resetPassword);

export default route;
