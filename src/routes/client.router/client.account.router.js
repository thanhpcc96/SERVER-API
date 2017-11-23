import { Router } from "express";
import validate from "express-validation";

import { authLocal, authJwt } from "../../services/auth.client";
import { acountClientController } from "../../controllers";
import upload from '../../helper/upload';

const route = new Router();

const validation = acountClientController.validation;

/** Đăng ký */
route.post(
  "/register",
  validate(validation.resgiter),
  acountClientController._postRegister
);

/** đăng nhập */
route.post(
  "/login",
  validate(validation.login),
  authLocal,
  acountClientController._postLogin
);

/** khôi phục mật khẩu */
route.post(
  "/forgot",
  validate(validation.resetpassword),
  acountClientController._postResetPassword
);

/* route.post('/reset/:token',ClientController._resetPassword) */
route.post("/reset",acountClientController._postSetingNewPassword);


/** Test get All */
route.get("/all", acountClientController._getAll);

/** get thông tin cá nhân */
route.get("/profile", authJwt, acountClientController._getInfo);

/** Update thông tin cá nhân */
route.post(
  "/profile",
  authJwt,
  validate(validation.updateInfo),
  acountClientController._postUpdateInfo
);

route.post('/upload',authJwt,upload.single('avatar'), acountClientController.uploadAvatar)

/** Update mật khẩu */
route.post(
  "/profile/password",
  authJwt,
  validate(validation.updatePassWord),
  acountClientController._postUpdatePassword
);

/** get thông tin lịch sử giao dịch */
route.get(
  "/profile/history",
  authJwt,
  acountClientController._getHistoryExchange
);

export default route;
