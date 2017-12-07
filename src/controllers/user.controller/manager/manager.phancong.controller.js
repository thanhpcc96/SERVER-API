import HTTPStatus from 'http-status';
import Joi from 'joi';
import moment from 'moment';
import ChuyenModel from '../../../models/chuyenxe.model';
import TuyenModel from '../../../models/lotrinh.model';
import CoachModel from '../../../models/coach.model';
import UserModel from '../../../models/user.model';
import PhanCongModel from '../../../models/phancong.model';

export async function _getPhanCong(req, res, next) {
  try {
    // const ketqua = await ChuyenModel.find({
    //   // timeStart: {
    //   //   $gte: moment().set({ hour: 0, minute: 0, second: 0 }),
    //   //   $lte: moment().set({ hour: 23, minute: 59, second: 0 }),
    //   // },
    // }).populate({
    //   path: 'coach',
    //   populate: [
    //     {
    //       path: 'phutrach.laixe',
    //       model: 'users',
    //     },
    //     {
    //       path: 'phutrach.phuxe',
    //       model: 'users',
    //     },
    //     {
    //       path: 'trongtuyen',
    //       model: 'lotrinh',
    //     },
    //   ],
    // });\

    const ketqua = await PhanCongModel.find({
      ngayphancong: {
        $gte: moment().subtract(2,"day").set({ hour: 23, minute: 59, second: 0 }),
      },
    });

    return res.status(HTTPStatus.OK).json({ err: false, result: ketqua });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
