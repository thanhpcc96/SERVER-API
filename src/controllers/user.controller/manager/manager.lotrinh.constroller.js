import HTTPStatus from 'http-status';
import Joi from 'joi';

import LotrinhModel from '../../../models/lotrinh.model';
import { filteredBody } from '../../../ultils/filterBody';

export const vaildation = {
  creatTuyen: {
    body: {
      from: Joi.string().required(),
      to: Joi.string().required(),
      lotrinh: Joi.string().required(),
      vitriChotKT: Joi.string().required(),
      gpxFileName: Joi.string().required(),
      thoigianvanchuyen:Joi.number().required(),
      xetronglotrinh: Joi.string(),
    },
  },
  updateTuyen:{
    body:{
      idtuyen: Joi.string().required(),
      from: Joi.string(),
      to: Joi.string(),
      lotrinh: Joi.string(),
      vitriChotKT: Joi.string(),
      gpxFileName: Joi.string(),
      xetronglotrinh: Joi.string(),
      thoigianvanchuyen:Joi.number(),
    }
  }
};
export async function creatTuyen(req, res, next) {
  const whitelist = [
    'from',
    'to',
    'lotrinh',
    'thoigianvanchuyen',
    'vitriChotKT',
    'gpxFileName',
    'xetronglotrinh',
  ];
  const body = filteredBody(req.body, whitelist);
  try {
    const lotrinhArr = body.lotrinh.split(';');
    const vitrichokt = body.vitriChotKT.split(';');
    const dataFromBody = {
      routeOfTrip: {
        from: body.from,
        to: body.to,
        lotrinh: lotrinhArr,
      },
      thoigianvanchuyen: body.thoigianvanchuyen,
      vitriChotKT: vitrichokt,
      gpxFileName: body.gpxFileName,
    };
    let xetronglotrinhArr;
    if (body.xetronglotrinh) {
      xetronglotrinhArr = body.xetronglotrinh.split(';');
      dataFromBody.xetronglotrinh = xetronglotrinhArr;
    }
    return res
      .status(HTTPStatus.CREATED)
      .json({ err: false, result: await LotrinhModel.create(dataFromBody) });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function getAllTuyen(req, res, next) {
  try {
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await LotrinhModel.find().populate('xetronglotrinh') });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function updateTuyen(req, res, next) {
  const whitelist = [
    'idtuyen',
    'from',
    'to',
    'lotrinh',
    'thoigianvanchuyen',
    'vitriChotKT',
    'gpxFileName',
    'xetronglotrinh',
  ];
  const body = filteredBody(req.body, whitelist);
  try {
    if (req.user.role !== 1) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({
          err: true,
          message: 'Ban khong du quyen thuc thuc hien chuc nang nay',
        });
    }
    const lotrinhArr = body.lotrinh ? body.lotrinh.split(';') : null;
    const vitrichoktArr = body.vitriChotKT ? body.vitriChotKT.split(';') : null;
    const xetronglotrinhArr = body.xetronglotrinh
      ? body.xetronglotrinh.split(';')
      : null;
    const oldTuyen = await LotrinhModel.findById(body.idtuyen);
    oldTuyen.routeOfTrip.from = body.from || oldTuyen.routeOfTrip.from;
    oldTuyen.routeOfTrip.to = body.to || oldTuyen.routeOfTrip.to;
    oldTuyen.routeOfTrip.lotrinh = lotrinhArr || oldTuyen.routeOfTrip.lotrinh;
    oldTuyen.thoigianvanchuyen =
      body.thoigianvanchuyen || oldTuyen.thoigianvanchuyen;
    oldTuyen.vitriChotKT = vitrichoktArr || oldTuyen.vitriChotKT;
    oldTuyen.gpxFileName = body.gpxFileName || oldTuyen.gpxFileName;
    oldTuyen.gpxFileName = body.gpxFileName || oldTuyen.gpxFileName;
    oldTuyen.xetronglotrinh = xetronglotrinhArr || oldTuyen.xetronglotrinh;

    const newTuyen= await oldTuyen.save()
    return res
      .status(HTTPStatus.CREATED)
      .json({ err: false,soxe: newTuyen.xetronglotrinh.lenght, result: newTuyen });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
