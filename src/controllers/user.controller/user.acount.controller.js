import HTTPStatus from "http-status";
import Joi from "joi";

import UserModel from "../../models/user.model";
import constants from "../../config/constants";
import { filteredBody } from "../../ultils/filterBody";
import agenda from '../../jobLoader'

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
  updateInfo: {
    body: {
      firstname: Joi.string(),
      lastname: Joi.string(),
      address: Joi.string(),
      dateofbirth: Joi.date(),
      phone: Joi.string().regex(/^[0-9-+]+$/)
    }
  },
  updatePassWord: {
    body: {
      password: Joi.string()
        .min(6)
        .required(),
      newpassword: Joi.string()
        .min(6)
        .required()
    }
  }
};

/**
 * Hàm post Login sử dụng authencation
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
export async function _postLogin(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
}

/* ====================================================================================================================================================================== */

/**
 * Ham get du lieu ve cua 1 user ve
 * @param {*} req
 * @param {*} res
 */
export async function _getUserInfo(req, res, next) {
  try {
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await UserModel.findById(req.user._id) });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

/* ====================================================================================================================================================================== */

/**
 * Ham update thong tin user
 * @param {Object} req
 * @param {Object} res
 */
export async function _postUpdateInfo(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.manager.updateInfo);
  try {
    const id = req.user._id;
    if(req.user.role !== 1){
      return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: " Ban khong du quyen de thay doi thong tin"});
    }
    const userCurrent = await UserModel.findById(id);
    userCurrent.info.firtname = body.firtname || userCurrent.info.firtname;
    userCurrent.info.lastname = body.lastname || userCurrent.info.lastname;
    userCurrent.info.address = body.address || userCurrent.info.address;
    userCurrent.info.dateofbirth =
      body.dateofbirth || userCurrent.info.dateofbirth;
    userCurrent.info.phone = body.phone || userCurrent.info.phone;
    res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await userCurrent.save() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}



/* ====================================================================================================================================================================== */

export async function _postUpdatePass(req, res, next) {
  const body = filteredBody(
    req.body,
    constants.WHITELIST.manager.updatePassWord
  );
  try {
    const idUser = req.user._id;
    const userCurrent = await UserModel.findById(idUser);
    if (!userCurrent.authenticateUser(body.password)) {
      return res
        .status(HTTPStatus.NON_AUTHORITATIVE_INFORMATION)
        .json({ err: true, message: "Mat khau cu khong trung khop" });
    }
    userCurrent.password = body.newpassword;
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await userCurrent.save() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

// export function _postDangKiLichLamViec(req, res, next) {
//     try {
//         const user = req.user;
//         let role = user.role;
//         if (role === 1 && role === 2) {

//         }
//     } catch (err) {

//     }

// }
/* ====================================================================================================================================================================== */

export async function testCreateUser(req, res, next) {
  try {
    const user = {
      info: {
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        phone: req.body.phone,
        dateofbirth: req.body.dateofbirth,
        passport: req.body.passport,
        gender: req.body.gender,
        address: req.body.address
      },
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
      role: req.body.role
    };
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await UserModel.create(user) });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function _postResetPassword(req, res, next) {
  const body = filteredBody(req.body,["email"]);
  try {
    const user = await UserModel.findOne({ 'email': body.email });
    if (!user) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ error: true, message: 'Tài khoản không tồn tại' });
    }
    const resetPasswordToken = crypto.randomBytes(16).toString('hex');
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires =
      Date.now() + 18000000; /* 60*60*1000 *5/ 5 tieng */
    const mailOption = {
      from: 'Hai Au copany <services.haiaucompany@gmail.com>',
      to: body.email,
      subject: 'Khôi phục mật khẩu tài khoản nhân viên',
      text: ` Xin chào ${user.info.fullname}, có vẻ bạn vừa yêu cầu khôi phục mật khẩu nhân viên!
              nếu chính xác là bạn quên mật khẩu vui lòng truy cập:

                  >>>>>  http://localhost:3000/user/forgot/${resetPasswordToken} <<<<<

              Nếu không phải bạn, có thể tài khoản của bạn đã bị tấn công, vui lòng liên hệ ban quản lý! `,
    };
    agenda.now('sendmail', mailOption); /* send mail Ngay lập tức */
    await user.save();

    return res
      .status(HTTPStatus.OK)
      .json({ error: false, message: 'Vui lòng check mail' });
  } catch (error) {
    console.log('=====================================');
    console.log('Lỗi ở forgot', error);
    console.log('=====================================');
    error.status = HTTPStatus.BAD_REQUEST;
    return next(error);
  }
}
