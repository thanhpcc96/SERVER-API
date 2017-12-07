import HTTPstatus from 'http-status';
import Joi from 'joi';

import { filteredBody } from '../../../ultils/filterBody';
import LotrinhModel from '../../../models/lotrinh.model';
import CoachModel from '../../../models/coach.model';
import UserModel from '../../../models/user.model';
import agenda from '../../../jobLoader';

export const validation = {
  createCoach: {
    body: {
      numberplate: Joi.string().required(),
      seat: Joi.number().required(),
      name: Joi.string(),
      productiontime: Joi.date(),
    },
  },
  updateCoach: {
    body: {
      idxe: Joi.string().required(),
      seat: Joi.number(),
      name: Joi.string(),
      productiontime: Joi.date(),
    },
  },
  deleteCoach: {
    body: {
      numberplate: Joi.string().required(),
    },
  },
};

export async function getAllCoach(req, res, next) {
  try {
    const kq = await CoachModel.find()
      .populate('phutrach.laixe', 'info.fullname')
      .populate('phutrach.phuxe', 'info.fullname');
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, length: kq.length, result: kq });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}
export async function getInfoCoach(req, res, next) {
  try {
    const kq = await CoachModel.findById(req.params.id)
      .populate('phutrach.laixe')
      .populate('phutrach.phuxe');
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, length: kq.length, result: kq });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}
export async function createCoach(req, res, next) {
  const whiteList = [
    'numberplate',
    'seat',
    'name',
    'productiontime',
    'idlaixe',
    'idphuxe',
  ];
  const body = filteredBody(req.body, whiteList);
  const xe = {
    numberplate: body.numberplate,
    seat: body.seat,
    name: body.name,
    productiontime: body.productiontime,
    phutrach: {
      laixe: body.idlaixe,
      phuxe: body.idphuxe,
    },
  };
  try {
    const result = await CoachModel.create(xe);
    agenda.now('savelog', {
      user: req.user._id,
      action: {
        name: 'Tạo mới xe ',
        detail: [result],
      },
      status: 'SUCCESS',
      time: Date.now(),
    });
    return res.status(HTTPstatus.CREATED).json({ err: false, result });
  } catch (err) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Tạo mới xe' },
      status: 'FAIL',
      time: Date.now(),
    });
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}

export async function deleteCoach(req, res, next) {
  const body = filteredBody(req.body, 'numberplate');
  try {
    await CoachModel.findOneAndRemove({ numberplate: body.numberplate });
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Tạo mới xe' },
      status: 'SUCCESS',
      time: Date.now(),
    });
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, message: 'Da xoa thanh cong' });
  } catch (err) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Xóa xe' },
      status: 'FAIL',
      time: Date.now(),
    });
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}

export async function updateCoach(req, res, next) {
  const whiteList = [
    'idxe',
    'numberplate',
    'seat',
    'name',
    'productiontime',
    'idlaixe',
    'idphuxe',
  ];
  const body = filteredBody(req.body, whiteList);
  try {
    const oldCoach = await CoachModel.findById(body.idxe);
    let idlaixe;
    let idphuxe;
    let laixeResult;
    let phuxeResult;
    if (body.idlaixe) {
      idlaixe = oldCoach.phutrach.laixe;
    }
    if (body.idphuxe) {
      idphuxe = oldCoach.phutrach.phuxe;
    }
    if(idlaixe){
      laixeResult= await UserModel.findById(idlaixe);
    }
    if(idlaixe){
      phuxeResult= await UserModel.findById(idphuxe);
    }
    oldCoach.numberplate = body.numberplate || oldCoach.numberplate;
    oldCoach.seat = body.seat || oldCoach.seat;
    oldCoach.name = body.name || oldCoach.name;
    oldCoach.productiontime = body.productiontime || oldCoach.productiontime;
    oldCoach.phutrach.laixe = body.idlaixe || oldCoach.phutrach.laixe;
    oldCoach.phutrach.phuxe = body.idphuxe || oldCoach.phutrach.phuxe;
    agenda.now('savelog', {
      user: req.user._id,
      action: {
        name: 'Cập nhật thông tin xe',
        detail: [{ xeID: oldCoach._id }],
      },
      status: 'SUCCESS',
      time: Date.now(),
    });
    const arrPromise= await Promise.all([
      laixeResult.removeXePhanCong(),
      phuxeResult.removeXePhanCong(),
      oldCoach.save(),
    ])
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, result: arrPromise[2] });
  } catch (err) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Cập nhật thông tin xe' },
      status: 'FAIL',
      time: Date.now(),
    });
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}

/**
 *
*/
export async function _phanCong(req, res, next) {
  const body = filteredBody(req.body, ['idxe', 'idlaixe', 'idphuxe']);
  try {
    const ketqua = await CoachModel.findById(body.idxe);
    const laixe = await UserModel.findById(body.idlaixe);
    const phuxe = await UserModel.findById(body.idphuxe);
    if (!ketqua) {
      return res
        .status(HTTPstatus.NOT_FOUND)
        .json({ err: true, message: 'Không tìm thấy xe' });
    }
    ketqua.phutrach.laixe = body.idlaixe;
    ketqua.phutrach.phuxe = body.idphuxe;
    laixe.xephancong = body.idxe;
    phuxe.xephancong = body.idxe;
    await Promise.all([laixe.save(), phuxe.save()]);
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, result: await ketqua.save() });
  } catch (error) {
    error.status = HTTPstatus.BAD_REQUEST;
    next(error);
  }
}
