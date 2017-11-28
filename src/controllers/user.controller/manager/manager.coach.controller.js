import HTTPstatus from 'http-status';
import Joi from 'joi';

import { filteredBody } from '../../../ultils/filterBody';
import LotrinhModel from '../../../models/lotrinh.model';
import CoachModel from '../../../models/coach.model';
import ChuyenxeModel from '../../../models/coach.model';

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
      seat: Joi.number().required(),
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
    const kq= await CoachModel.find()
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, length: kq.length , result: kq });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}
export async function createCoach(req, res, next) {
  const whiteList = ['numberplate', 'seat', 'name', 'productiontime',"idlaixe","idphuxe"];
  const body = filteredBody(req.body, whiteList);
  const xe={
    numberplate: body.numberplate,
    seat: body.seat,
    name: body.name,
    productiontime: body.productiontime,
    phutrach:{
      laixe: body.idlaixe,
      phuxe: body.idphuxe,
    }
  }
  try {
    return res
      .status(HTTPstatus.CREATED)
      .json({ err: false, result: await CoachModel.create(xe) });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}

export async function deleteCoach(req, res, next) {
  const body = filteredBody(req.body, 'numberplate');
  try {
    await CoachModel.findOneAndRemove({ numberplate: body.numberplate });
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, message: 'Da xoa thanh cong' });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}

export async function updateCoach(req, res, next) {
  const whiteList = ['idxe', 'numberplate', 'seat', 'name', 'productiontime'];
  const body = filteredBody(req.body, whiteList);
  try {
    const oldCoach = await CoachModel.findById(body.idxe);
    oldCoach.numberplate = body.numberplate || oldCoach.numberplate;
    oldCoach.seat = body.seat || oldCoach.seat;
    oldCoach.name = body.name || oldCoach.name;
    oldCoach.productiontime = body.productiontime || oldCoach.productiontime;
    return res
      .status(HTTPstatus.OK)
      .json({ err: false, result: await oldCoach.save() });
  } catch (err) {
    err.status = HTTPstatus.BAD_REQUEST;
    return next(err);
  }
}
