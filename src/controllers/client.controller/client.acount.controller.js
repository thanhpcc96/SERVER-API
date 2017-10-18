import crypto from "crypto";
import HTTPStatus from "http-status";
import Joi from "joi";

import { filteredBody } from "../../ultils/filterBody";
import constants from "../../config/constants";
import agenda from "../../jobLoader"; // config worker */
import Client from "../../models/client.model";

// validate Form login cho khách hàng
export const validation = {
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
    }
  },
  resgiter: {
    body: {
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      phone: Joi.string()
        .regex(/^[0-9-+]+$/)
        .min(10)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(/^[/).regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
    }
  },
  resetpassword: {
    body: {
      email: Joi.string()
        .email()
        .required()
    }
  },
  updateInfo: {
    body: {
      email: Joi.string().email(),
      phone: Joi.string()
        .regex(/^[0-9-+]+$/)
        .min(10),
      firstname: Joi.string(),
      lastname: Joi.string(),
      address: Joi.string()
    }
  },
  updatePassWord: {
    body: {
      password: Joi.string()
        .regex(/^[/).regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
      newpassword: Joi.string()
        .regex(/^[/).regex(/^[a-zA-Z0-9]{3,30}$/)
        .required()
    }
  }
};

/* =================================================================================================================================== */

/**
 * @api {post} /client/login Login cho client(khách hàng)
 * @apiDescription Login a user
 * @apiName loginUser
 * @apiGroup User
 *
 * @apiParam (Body) {String} email client email.
 * @apiParam (Body) {String} password Client password.
 *
 * @apiSuccess {Number} gán status cho Req để cho thằng next bắn cho middleware tiếp theo.
 * @apiSuccess {String} _id User _id.
 * @apiSuccess {String} token Authentication token.
 *
 * @api Xác thực thành công respose sẽ trả về như sau
 *
 * HTTP/1.1 200 OK
 *
 * {
 *  _id: '123',
 *  token: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio',
 * }
 *
 * @api Lỗi VD  {json} Error
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is required'
 *  }
 */
export async function _postLogin(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
}

/* eslint-disable-no-else-return */
/* eslint-disable no-console */
export async function _getAll(req, res) {
  try {
    const list = await Client.find();
    console.log(list);
    return res.status(HTTPStatus.OK).json({ err: false, result: list });
  } catch (err) {
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .json({ err: true, message: " Loi" });
  }
}

/* =================================================================================================================================== */
/**
 * @api {post} /client/register Đăng ký tài khoản Khách hàng mới
 * @apiDescription Tạo ra Tài khoản khách hàng
 * @apiName _postRegister
 * @apiGroup Khách hàng
 *
 * @apiParam (Body) {String} email Khách hàng email.
 * @apiParam (Body) {String} password Khách hàng password.
 * @apiParam (Body) {String} firstname Khách hàng firstname.
 * @apiParam (Body) {String} lastname Khách hàng lastname.
 * @apiParam (Body) {String} phone Khách hàng số điện thoại.
 *
 * @apiSuccess {Number} status Status code phản hồi Request.
 * @apiSuccess {String} _id Khách hàng _id.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Ví dụ đăng ký thành công
 *
 * HTTP/1.1 200 OK
 *
 * {
 *  _id: '123',
 *  token: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio',
 * }
 *
 * @apiErrorExample {json} lỗi
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is required'
 *  }
 */
export async function _postRegister(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.client.register);
  try {
    /**
    const client = await Client.findOne({ "local.email": req.body.email });
    if (client) {
      return res
        .status(HTTPStatus.NOT_ACCEPTABLE)
        .json({ error: true, message: "Tai khoan nay da ton tai" });
    }
    const newClient = new Client();
    newClient.info.firstname = req.body.firstname;
    newClient.info.lastname = req.body.lastname;
    newClient.phone = req.body.phone;
    newClient.local.email = req.body.email;
    newClient.local.password = req.body.password;
    newClient.status = "ACTIVE"; // chưa kích hoạt
    return res
      .status(HTTPStatus.CREATED)
      .json({ error: false, result: await newClient.save() });
      */
    const filterToClient = {
      phone: body.phone,
      info: {
        firstname: body.firstname,
        lastname: body.lastname
      },
      local: {
        email: body.email,
        password: body.password
      },
      status: "ACTIVE"
    };

    const client = await Client.create(filterToClient);
    return res
      .status(HTTPStatus.CREATED)
      .json({ err: false, result: client.toAuthJSON() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

/* =================================================================================================================================== */

export async function _getInfo(req, res, next) {
  try {
    console.log("=======================================");
    console.log(req);
    console.log("=======================================");
    const _idClient = req.user._id;
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await Client.findById(_idClient) });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

/* =================================================================================================================================== */
/**
 * @api {post} /client/forgot Khôi phục mật khẩu cho Khách hàng
 * @apiDescription Khôi phục mật khẩu cho Khách hàng
 * @apiName _postResetPassword
 * @apiGroup Khách hàng
 *
 * @apiParam (Body) {String} email Khách hàng email.
 *
 * @apiSuccess {Number} status Status code phản hồi Request.
 *
 * @apiSuccessExample
 * 
 * 
 * HTTP/1.1 200 OK
 *
 * { 
 *  error: false, 
 *  message: "Vui lòng check mail" 
 * }
 *
 * @apiErrorExample {json} lỗi
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is required'
 *  }
 */
export async function _postResetPassword(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.client.resetPassword);
  try {
    const client = await Client.findOne({ "local.email": body.email });
    if (!client) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ error: true, message: "Tài khoản không tồn tại" });
    }
    const resetPasswordToken = crypto.randomBytes(16).toString("hex");
    client.local.resetPasswordToken = resetPasswordToken;
    client.local.resetPasswordExpires =
      Date.now() + 18000000; /* 60*60*1000 *5/ 5 tieng */
    const mailOption = {
      from: "Hai Au copany <services.haiaucompany@gmail.com>",
      to: body.email,
      subject: "Khôi phục mật khẩu",
      text: ` Xin chào ${client.info.firstname} ${client.info
        .lastname}, vui lòng nhấp vào link để đặt lại mặt khẩu của bạn:
                        http://localhost:3000/client/forgot/${resetPasswordToken}`
    };
    agenda.now("sendmail", mailOption); /* send mail Ngay lập tức */

    return res
      .status(HTTPStatus.OK)
      .json({ error: false, message: "Vui lòng check mail" });
  } catch (error) {
    console.log("=====================================");
    console.log("Lỗi ở forgot", error);
    console.log("=====================================");
    error.status = HTTPStatus.BAD_REQUEST;
    return next(error);
  }
}

/* =================================================================================================================================== */

/*
* Post reset password khi co token
 */
// export async function _resetPassword(req, res) {
//     try {
//         let token = req.params.token;
//         const client = await Client.findOne({ "local.resetPasswordToken": token.trim() });
//         if (!client) {
//             return res.status(404).json({ error: true, message: "Mã xác nhận không hợp lệ" });
//         }
//         if (client.local.resetPasswordExpires < new Date()) {
//             return res.status(400).json({
//                 error: true,
//                 message: 'Mã xác nhận đã hết hạn từ ' + client.local.resetPasswordExpires
//             });
//         } else {
//             client.local.password = req.body.password;
//             return res.status(200).json({ error: false, result: await client.save() })
//         }
//     } catch (error) {
//         console.log('=====================================');
//         console.log("Lỗi ở forgot", error);
//         console.log('=====================================');
//     }
// }

/* =================================================================================================================================== */

/**
 * @api {post} /client/profile Update thông tin tài khoản khách hàng
 * @apiDescription Update thông tin tài khoản khách hàng
 * @apiName _postUpdateInfo
 * @apiGroup Khách hàng
 *
 * @apiParam (Body) {String} email Khách hàng email.
 * @apiParam (Body) {String} firstname Khách hàng firstname.
 * @apiParam (Body) {String} lastname Khách hàng lastname.
 * @apiParam (Body) {String} address Khách hàng address.
 * @apiParam (Body) {String} phone Khách hàng phone.
 *
 * @apiSuccess {Number} status Status code phản hồi Request.
 *
 * @apiSuccessExample
 * 
 * 
 * HTTP/1.1 200 OK
 *
 * { 
 *  error: false, 
 *  result:{
 *        thong tin cua Khach hang sau cap nhat
 *    } 
 * }
 *
 * @apiErrorExample {json} lỗi
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    email: 'email is in incorrect'
 *  }
 */
export async function _postUpdateInfo(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.client.updateInfo);
  console.log("====================================");
  console.log(body);
  console.log("====================================");
  try {
    // const client = await Client.findById(req.client._id);
    // if (!client) {
    //   return res
    //     .status(404)
    //     .json({ error: true, message: "khong ton tai user" });
    // }
    // client.info.firstname = client.info.firstname || req.body.firstname;
    // client.info.lastname = client.info.lastname || req.body.lastname;
    // client.info.address = client.info.address || req.body.address;
    // if (!req.body.email && req.body.email !== client.local.email) {
    //   const clientCheck = await Client.findOne({
    //     "local.email": req.body.email
    //   });
    //   if (clientCheck)
    //     return res.status(301).json({
    //       error: true,
    //       message: "Email ton tai roi khong the them moi"
    //     });
    // }
    // client.local.email = client.local.email || req.body.email;
    // if (client._hashPassword(req.body.oldpassword) !== client.local.password) {
    //   return res
    //     .status(301)
    //     .json({ error: true, message: "Mat khau cu khong khop" });
    // }
    // client.local.password = req.body.newpassword;
    // return res.status(200).json({ error: false, result: await client.save() });
    const _idClient = req.user._id;
    const client = await Client.findById(_idClient);
    client.phone = body.phone || client.phone;
    client.info.firstname = body.firstname || client.info.firstname;
    client.info.lastname = body.lastname || client.info.lastname;
    client.info.address = body.address || client.info.address;
    client.local.email = body.email || client.local.email;

    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await client.save() });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    return next(error);
  }
}

/* =================================================================================================================================== */
/**
 * @api {post} /client/profile/password Update Mật khẩu cho khách hàng
 * @apiDescription Update Mật khẩu cho khách hàng
 * @apiName _postUpdatePassword
 * @apiGroup Khách hàng
 *
 * @apiParam (Body) {String} password Khách hàng password.
 * @apiParam (Body) {String} newpassword Khách hàng newpassword.
 *
 * @apiSuccess {Number} status Status code phản hồi Request.
 * @apiSuccess {String} _id Khách hàng _id.
 * @apiSuccess {String} token Authentication token.
 *
 * @apiSuccessExample Ví dụ đăng ký thành công
 *
 * HTTP/1.1 200 OK
 *
 * {
 *  _id: '123',
 *  token: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTBhMWI3ODAzMDI3N2NiNjQxM2JhZGUiLCJpYXQiOjE0OTM4MzQ2MTZ9.RSlMF6RRwAALZQRdfKrOZWnuHBk-mQNnRcCLJsc8zio',
 * }
 *
 * @apiErrorExample {json} lỗi
 *  HTTP/1.1 400 Bad Request
 *
 *  {
 *    password: 'password is required'
 *  }
 */
export async function _postUpdatePassword(req, res, next) {
  const body = filteredBody(
    req.body,
    constants.WHITELIST.client.updatePassWord
  );
  try {
    const _idClient = req.user._id;
    const client = await Client.findById(_idClient);
    if (!client.authenticateClientUser(body.password)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ err: true, message: "Mật khẩu cũ không đúng" });
    }
    client.local.password = body.newpassword;
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await client.save() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
