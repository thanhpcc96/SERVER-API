import HTTPStatus from "http-status";
import fs from "fs";
import path from "path";
import Joi from "joi";

import User from "../../../models/user.model";
import { filteredBody } from "../../../ultils/filterBody";
import constants from "../../../config/constants";

export const validation = {
  deleteUser: {
    body: {
      iduser: Joi.string()
    }
  },
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      username: Joi.string()
        .min(4)
        .required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      dateofbirth: Joi.date().required(),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      passport: Joi.string()
        .regex(/^[0-9-+]+$/)
        .required(),
      phone: Joi.string()
        .regex(/^[0-9-+]+$/)
        .required(),
      role: Joi.number().required()
    }
  }
};

/**
 * Hàm thực hiện load danh sách user
 * Chỉ quản lý nhân sự và Người có quyên cao hơn được phép
 * Thực hiện quyền này
 * @param {Object} req
 * @param {Object} res
 */
export async function _getAllUser(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: "Bạn không có quyền truy cập chức năng này"
      });
    }
    const listUser = await User.find({ role: { $gt: 1 } });
    if (!listUser) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: "Xuất hiện lỗi từ yêu cầu của bạn" });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: listUser });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/**
 * Hàm thực hiện xóa nhân viên
 * Chỉ cho phép xóa từng người
 * Chỉ có quản lý nhân sự và admin được xóa
 * @param {Object} req
 * @param {Object} res
 */
export async function _deleteUser(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.manager.deleteUser);
  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: "Bạn không có quyền truy cập chức năng này"
      });
    }
    if (user._id === body.iduser) {
      return res
        .status(HTTPStatus.NOT_MODIFIED)
        .json({ err: true, message: "Không hỗ trợ xóa tài khoản Quản lý!" });
    }
    await User.findByIdAndRemove(body.iduser);
    return res
      .status(HTTPStatus.CONTINUE)
      .json({ err: false, result: " Xóa thành công user Nhân viên" });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/**
 * HÀM tạo 1 user mới có sử dụng upload file
 * @param {Object} req
 * @param {Object} res
 */
export async function _postCreateUser(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.manager.createUser);

  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: "Bạn không có quyền truy cập chức năng này"
      });
    }
    const filterToData = {
      email: body.email,
      username: body.username,
      password: "123456789",
      info: {
        firstname: body.firstname,
        lastname: body.lastname,
        dateofbirth: body.dateofbirth,
        gender: body.gender,
        address: body.address,
        passportNumber: body.passport,
        phoneNumber: body.phone,
        photoProfile: []
      },
      role: body.role, // body.role > 1 ? body.role : 3,
      status: "ACTIVE"
    };
    return res
      .status(HTTPStatus.CREATED)
      .json({ err: false, result: await User.create(filterToData) });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/* ====================================================================================================================================================================== */

export function uploadPhotoProfile(req, res, next) {
  try {
    const idUser= req.body.idUser;
    if(!req.files){
      return res.status(HTTPStatus.BAD_REQUEST).json({err: true, message: ' Loi roi'});
    }
    req.files.forEach( async file =>{
      await User.findByIdAndUpdate(idUser,
        {
          $push: { "info.photoProfile": file.location}
        },
        { new: true });
    });
     return res.status(200).json({err: false, message: 'Upload thanh cong'});
  } catch (err) {
    err.status=HTTPStatus.BAD_GATEWAY;
    return next(err);
  }
  
}
