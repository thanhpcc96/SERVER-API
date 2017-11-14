import HTTPStatus from 'http-status';
import Joi from 'joi';
import { filteredBody } from '../../../ultils/filterBody';

import TicketModel from '../../../models/ticket.model';

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
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await TicketModel.find() });
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
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({
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
    const veCheckDuoc = await TicketModel.findOne({ codeTicket: body.mave });
    if (!veCheckDuoc) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Ve Khong ton tai' });
    }
    veCheckDuoc.isDoneCheck = true;
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await veCheckDuoc.save() });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
