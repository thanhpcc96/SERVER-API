import HTTPStatus from 'http-status';
import Joi from 'joi';
import agenda from '../../../jobLoader';

import Client from '../../../models/client.model';
import RecordModel from '../../../models/activity.log.model';
import constants from '../../../config/constants';
import { filteredBody } from '../../../ultils/filterBody';

export const validation = {
  deleteClient: {
    body: {
      one: Joi.string(),
      list: Joi.string(),
    },
  },
  rechairCoin: {
    body: {
      idclient: Joi.string().required(),
      amount: Joi.number().required(),
    },
  },
  getTicketPaymentOfClient: {
    body: {
      idclient: Joi.string(),
    },
  },
};

/**
 * Hàm xử lý bất đồng bộ,
 * Nếu quyền là Admin, quản lý thì có quyền
 * load hết thông tin hành khách ra
 * @param {Object} req - đối tượng request
 * @param {Object} res - đối tượng response
 */
export async function _getAllClient(req, res, next) {
  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: 'Bạn không có quyền truy cập chức năng này!',
      });
    }
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await Client.find({}) });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    return next(error);
  }
}
/**
 * Hàm bất đồng bộ
 * Xóa khách hàng theo list,
 * còn điều kiện lọc thực hiện ở phía client
 * @param {Object} req - Request object-- client gửi lên
 * @param {Object} res- Response object -- gửi về client
 */
export async function _deleteClient(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.manager.deleteClient);
  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: 'Ban khong co quyen truy cap chuc nang nay!',
      });
    }
    // let dataQuery = body.one === undefined ? body.list : body.one;
    if (body.list) {
      const dataQuery = body.list.split(';');
      await Client.deleteMany({ _id: { $in: dataQuery } });
      return res.status(HTTPStatus.OK).json({
        err: false,
        message: `Xoa thanh cong ${dataQuery.lenght} khach hang`,
      });
    }
    await Client.findByIdAndRemove(body.one);
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, message: 'Xoa thanh cong 1 khach hang' });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/**
 * Hàm xử lý giao dịch nạp tiền tài khoản của
 * khách hàng có lưu lại lịch sử giao dịch
 * @param {Object} req - đối tượng request
 * @param {Object} res - đối tượng response
 */
export async function _putRechairCoin(req, res, next) {
  const body = filteredBody(req.body, constants.WHITELIST.manager.rechairCoin);
  try {
    const user = req.user;
    if (user.role !== 1) {
      return res.status(HTTPStatus.FORBIDDEN).json({
        err: true,
        message: 'Ban khong co quyen truy cap chuc nang nay!',
      });
    }
    const client = await Client.findById(body.idclient);
    if (!client) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ err: true, message: 'Khach hang khong ton tai' });
    }
    const oldBalace = client.acount_payment.balance;
    client.acount_payment.balance = oldBalace + parseInt(body.amount, 0);
    const infoRechair = {
      rechargeTime: Date.now(),
      idUser: user._id, // Id nhan vien nhan tien
      amountSend: parseInt(body.amount, 0),
      oldBalace,
    };
    client.acount_payment.history_recharge.push(infoRechair);
    agenda.now('savelog', {
      user: user._id,
      action: {
        name: 'Nạp tiền tài khoản',
        detail: [{ ...infoRechair, client: body.idclient }],
      },
      status: 'SUCCESS',
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await client.save() });
  } catch (err) {
    agenda.now('savelog', {
      user: req.user._id,
      action: { name: 'Nạp tiền tài khoản' },
      status: 'FAIL',
    });
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
/**
 * Hàm lấy ra những danh sách những vé mà 1 khách hàng đã đặt
 * @param {Object} req
 * @param {Object} res
 */
export async function _getAllTicketPaymentOfClient(req, res, next) {
  const body = filteredBody(req.params, ['idclient']);
  try {
    const kq = await Client.findById(body.idclient)
      .populate('acount_payment.history_transaction')
      .populate('acount_payment.history_pick_keep_seat');

    return res.status(HTTPStatus.OK).json({ err: false, result: kq });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
export async function _getInfoClient(req, res, next) {
  const body = filteredBody(req.params, ['idclient']);
  try {
    const kq = await Client.findById(body.idclient)
      .populate('acount_payment.history_recharge.idUser')
      .populate('acount_payment.history_transaction')
      .populate('acount_payment.history_pick_keep_seat')
      .populate('acount_payment.history_cancel_ticket');
    return res.status(HTTPStatus.OK).json({ err: false, result: kq });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
