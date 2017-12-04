import HTTPStatus from 'http-status';
import Joi from 'joi';
import ChuyenxeModel from '../../../models/chuyenxe.model';
import { filteredBody } from '../../../ultils/filterBody';
import monent from 'moment';
import agenda from '../../../jobLoader';

export const validation = {
  getFullInfoChuyen: {
    body: {
      tenchuyen: Joi.string().required(),
    },
  },
};

export async function getAllChuyen(req, res, next) {
  try {
    if (req.user.role > 2) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ err: true, message: 'Ban khong co quyen' });
    }
    const result = await ChuyenxeModel.find({
      timeStart: { $gte: monent().subtract(1, 'day') },
    });
    if (!result) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Khong co ket qua' });
    }
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, lenght: result.length, result });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function getFullInfoChuyen(req, res, next) {
  const body = filteredBody(req.body, ['tenchuyen']);
  try {
    const ketqua = await ChuyenxeModel.findOne({ tenchuyen: body.sochuyen })
      .populate('routeOfTrip')
      .populate('thanhtrakiemtra')
      .populate('laixevaphuxe')
      .populate('coach')
      .populate('ticketsInChuyen')
      .populate('danhgia.khachhang', 'info.fullname');
    if (!ketqua) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'Xuat hien loi tu truy van cua ban' });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: ketqua });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function getFullInfoChuyenID(req, res, next) {
  const body = filteredBody(req.params, ['id']);
  try {
    const ketqua = await ChuyenxeModel.findById(body.id)
      .populate('routeOfTrip')
      .populate('thanhtrakiemtra')
      .populate('laixevaphuxe')
      .populate('coach')
      .populate('ticketsInChuyen')
      .populate('danhgia.khachhang', 'info.fullname');
    if (!ketqua) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'Xuat hien loi tu truy van cua ban' });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: ketqua });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function _disablePickTicketOnline(req, res, next) {
  try {
    const idChuyen = req.body.idchuyen;
    const chuyen = await ChuyenxeModel.findById(idChuyen);
    chuyen.disablePick = !chuyen.disablePick;
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Hủy đăng kí chuyến online', detail: [{ chuyenID: idChuyen }] },
      status: 'FAIL',
      time: Date.now()
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await chuyen.save() });
  } catch (error) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Hủy đăng kí chuyến online' },
      status: 'FAIL',
      time: Date.now()
    });
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
