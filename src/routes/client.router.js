import { Router } from "express";
import validate from "express-validation";

import { authLocal, authJwt } from "../services/auth.client";
import { clientControler } from "../controllers";
import upload from '../helper/upload';

const route = new Router();

const validation = clientControler.acountClientController.validation;

/** Đăng ký */
route.post(
  "/register",
  validate(validation.resgiter),
  clientControler.acountClientController._postRegister
);

/** đăng nhập */
route.post(
  "/login",
  validate(validation.login),
  authLocal,
  clientControler.acountClientController._postLogin
);

/** khôi phục mật khẩu */
route.post(
  "/forgot",
  validate(validation.resetpassword),
  clientControler.acountClientController._postResetPassword
);

/* route.post('/reset/:token',ClientController._resetPassword) */

/** Test get All */
route.get("/all", clientControler.acountClientController._getAll);

/** get thông tin cá nhân */
route.get("/profile", authJwt, clientControler.acountClientController._getInfo);

/** Update thông tin cá nhân */
route.post(
  "/profile",
  authJwt,
  validate(validation.updateInfo),
  clientControler.acountClientController._postUpdateInfo
);

route.post('/upload',authJwt,upload.single('avatar'), clientControler.acountClientController.uploadAvatar)

/** Update mật khẩu */
route.post(
  "/profile/password",
  authJwt,
  validate(validation.updatePassWord),
  clientControler.acountClientController._postUpdatePassword
);

/** get thông tin lịch sử giao dịch */
route.get(
  "/profile/history",
  authJwt,
  clientControler.acountClientController._getHistoryExchange
);

export default route;
