import HTTPStatus from 'http-status';
import Joi from 'joi';
import HTTPStatus from "http-status"
import ChuyenModel from '../../../models/chuyenxe.model';
import CoachModel from '../../../models/coach.model';
import UserModel from '../../../models/user.model';


export async function _getPhanCong(req, res, next) {
  try {
      const ketqua= await ChuyenModel.find({ timeStart:})
  } catch (error) {
    error.status=HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
