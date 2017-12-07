import HTTPStatus from 'http-status';
import Joi from 'joi';
import { filteredBody } from '../../../ultils/filterBody';

import TicketModel from '../../../models/ticket.model';
import agenda from '../../../jobLoader';

export const validation = {
  tickXeVe: {
    body: {
      mave: Joi.string().required(),
    },
  },
  getTicketInfo: {
    body: {
      mave: Joi.string().required(),
    },
  },
};

export async function getAllTicket(req, res, next) {
  try {
    if (req.user.role !== 1) {
      return res.status(HTTPStatus.UNAUTHORIZED).json({
        err: false,
        message: 'Ban khong co quyen truy cap chuc nang nay',
      });
    }
    const result = await TicketModel.find()
      .populate('inChuyenXe')
      .populate('Customer', 'info.fullname');
    return res.status(HTTPStatus.OK).json({ err: false, result });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function getTicketInfo(req, res, next) {
  const whitelist = ['mave'];
  const body = filteredBody(req.body, whitelist);
  try {
    const info = await TicketModel.findOne({ codeTicket: body.mave }).populate(
      'Customer',
    );
    if (!info) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        err: true,
        message: 'Khong tim thay ve hoac khong ton tai ve nay',
      });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: info });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function getTicketbyID(req, res, next) {
  const whitelist = ['mave'];
  const body = filteredBody(req.body, whitelist);
  try {
    const info = await TicketModel.findById(body.mave)
      .populate('inChuyenXe')
      .populate('Customer');
    if (!info) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        err: true,
        message: 'Khong tim thay ve hoac khong ton tai ve nay',
      });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: info });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function tickXeVe(req, res, next) {
  const whitelist = ['mave'];
  const body = filteredBody(req.body, whitelist);
  try {
    const veCheckDuoc = await TicketModel.findById(body.mave);
    if (!veCheckDuoc) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Ve Khong ton tai' });
    }
    veCheckDuoc.isDoneCheck = true;
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Xác nhận xé vé', detail: [{ idVe: veCheckDuoc._id }] },
      status: 'SUCCESS',
      time: Date.now(),
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await veCheckDuoc.save() });
  } catch (err) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Xác nhận xé vé' },
      status: 'FAIL',
      time: Date.now(),
    });
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
