import HTTPStatus from 'http-status';
import Joi from 'joi';
import ChuyenxeModel from '../../../models/chuyenxe.model';
import { filteredBody } from '../../../ultils/filterBody';

export const validation = {
  getFullInfoChuyen: {
    body: {
      ischuyen: Joi.string().required(),
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
    const result = await ChuyenxeModel.find();
    if (!result) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Khong co ket qua' });
    }
    return res.status(HTTPStatus.OK).json({ err: false, lenght:result.length, result });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function getFullInfoChuyen(req, res, next) {
  const body = filteredBody(req.body, ['sochuyen']);
  try {
    const ketqua = await ChuyenxeModel.findOne({sochuyen: body.sochuyen})
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
