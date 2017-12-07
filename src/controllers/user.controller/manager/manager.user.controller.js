import HTTPStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import moment from 'moment';

import User from '../../../models/user.model';
import ChuyenxeModel from '../../../models/chuyenxe.model';
import { filteredBody } from '../../../ultils/filterBody';
import constants from '../../../config/constants';

export const validation = {
  deleteUser: {
    body: {
      iduser: Joi.string(),
    },
  },
  updateInfo: {
    body: {
      // fullname: Joi.string(),
      // address: Joi.string(),
      // dateofbirth: Joi.date(),
      // email: Joi.string().email(),
      // passport: Joi.string(),
      // phone: Joi.string().regex(/^[0-9-+]+$/),
    },
  },
  createUser: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      username: Joi.string()
        .min(4)
        .required(),
      fullname: Joi.string().required(),
      dateofbirth: Joi.date().required(),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      passport: Joi.string()
        .regex(/^[0-9-+]+$/)
        .required(),
      phone: Joi.string()
        .regex(/^[0-9-+]+$/)
        .required(),
      role: Joi.number().required(),
    },
  },
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
        message: 'Bạn không có quyền truy cập chức năng này',
      });
    }
    const listUser = await User.find({ role: { $gt: 1 } });
    if (!listUser) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Xuất hiện lỗi từ yêu cầu của bạn' });
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
        message: 'Bạn không có quyền truy cập chức năng này',
      });
    }
    if (user._id === body.iduser) {
      return res
        .status(HTTPStatus.NOT_MODIFIED)
        .json({ err: true, message: 'Không hỗ trợ xóa tài khoản Quản lý!' });
    }
    await User.findByIdAndRemove(body.iduser);
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: ' Xóa thành công user Nhân viên' });
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
        message: 'Bạn không có quyền truy cập chức năng này',
      });
    }
    const filterToData = {
      email: body.email,
      username: body.username,
      password: '123456789',
      info: {
        fullname: body.fullname,
        dateofbirth: body.dateofbirth,
        gender: body.gender,
        address: body.address,
        passportNumber: body.passport,
        phoneNumber: body.phone,
        photoProfile: [],
      },
      role: body.role, // body.role > 1 ? body.role : 3,
      status: 'ACTIVE',
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
    const idUser = req.body.idUser;
    if (!req.files) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: ' Loi roi' });
    }
    req.files.forEach(async file => {
      await User.findByIdAndUpdate(
        idUser,
        {
          $push: { 'info.photoProfile': file.location },
        },
        { new: true },
      );
    });
    return res.status(200).json({ err: false, message: 'Upload thanh cong' });
  } catch (err) {
    err.status = HTTPStatus.BAD_GATEWAY;
    return next(err);
  }
}

export async function _getInfoUser(req, res, next) {
  try {
    const id = req.params.id;
    console.log('===================iddddd============');
    console.log(id);
    console.log('===============================');
    const user = await User.findById(id);
    return res.status(HTTPStatus.OK).json({ err: false, result: user });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
export async function _uploadFile(req, res, next) {
  try {
    const nhanvienID = req.body.id;
    if (!req.files) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'Loi roi' });
    }
    const f = req.files[0];
    console.log('================file===============');
    console.log(f);
    console.log('===============================');
    return res.status(HTTPStatus.OK).json({
      err: false,
      result: await User.findByIdAndUpdate(
        nhanvienID,
        { 'info.photoProfile': f.location },
        { new: true },
      ),
    });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function _postUpdateInfo(req, res, next) {
  const body = filteredBody(req.body, [
    ...constants.WHITELIST.manager.updateInfo,
    'iduser',
  ]);
  try {
    const id = body.iduser;
    if (req.user.role !== 1) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        err: true,
        message: ' Ban khong du quyen de thay doi thong tin',
      });
    }
    const userCurrent = await User.findById(id);

    userCurrent.info.fullname = body.fullname || userCurrent.info.fullname;
    userCurrent.info.address = body.address || userCurrent.info.address;
    userCurrent.info.passportNumber =
      body.passport || userCurrent.info.passportNumber;
    userCurrent.info.dateofbirth =
      body.dateofbirth || userCurrent.info.dateofbirth;
    userCurrent.info.phone = body.phone || userCurrent.info.phone;
    userCurrent.role = body.role || userCurrent.role;
    res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await userCurrent.save() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function _getPhanCongNhanVien(req, res, next) {
  try {
    const chuyens = await ChuyenxeModel.find({
      timeStart: {
        $gte: moment().set({ hour: 0, minute: 0, second: 0 }),
        $lte: moment().set({ hour: 23, minute: 59, second: 0 }),
      },
    }).populate('coach');

    if (req.user.role === 2) {
      const lich = [];
      chuyens.forEach(chuyen => {
        console.log('===============================');
        console.log(chuyen);
        console.log('===============================');
        if (chuyen.coach!==null) {
          if (chuyen.coach.phancong) {
            if (chuyen.coach.phancong.laixe) {
              if (chuyen.coach.phutrach.laixe === req.user._id.toString()) {
                console.log(
                  '============req.user._id===phu xe================',
                );
                console.log(req.user._id);
                console.log('===============================');
                lich.push(chuyen);
              }
            }
          }
        }
      });
      return res.status(HTTPStatus.OK).json({ err: false, result: lich , chuyens});
    }
    if (req.user.role === 3) {
      const lich = [];
      chuyens.forEach(chuyen => {
        console.log('===============================');
        console.log(chuyen);
        console.log('===============================');
        if (chuyen.coach!==null) {
          if (chuyen.coach.phancong) {
            if (chuyen.coach.phancong.phuxe) {
              if (chuyen.coach.phutrach.phuxe === req.user._id.toString()) {
                console.log(
                  '============req.user._id===phu xe================',
                );
                console.log(req.user._id);
                console.log('===============================');
                lich.push(chuyen);
              }
            }
          }
        }
      });
      return res.status(HTTPStatus.OK).json({ err: false, result: lich , chuyens});
    }
    return res.status(HTTPStatus.BAD_REQUEST).json({
      err: true,
      message: 'Khong co phan cong',
      chuyens,
    });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}

export async function _getListLaiXeChuaPhanCong(req, res, next) {
  try {
    const kq = [];
    const listResult = await User.find({ role: 2 });
    listResult.forEach(user => {
      if (!user.xephancong) {
        kq.push(user);
      }
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, soluong: kq.length, result: kq });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
export async function _getListPhuXeChuaPhanCong(req, res, next) {
  try {
    const kq = [];
    const listResult = await User.find({ role: 3 });
    listResult.forEach(user => {
      if (!user.xephancong) {
        kq.push(user);
      }
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, soluong: kq.length, result: kq });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
