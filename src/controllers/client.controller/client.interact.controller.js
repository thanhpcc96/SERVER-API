import HTTPStatus from 'http-status';
import Joi from 'joi';

import Ticket from '../../models/ticket.model';
import Chuyen from '../../models/chuyenxe.model.js';
import Client from '../../models/client.model';
import { filteredBody } from '../../ultils/filterBody';

export const validation = {
  getinfove: {
    body: {
      idve: Joi.string().required(),
    },
  },
  putComment: {
    body: {
      idchuyen: Joi.string().required(),
      comment: Joi.string().required(),
    },
  },
};

/**
 * Phương thức get toàn bộ danh sách chuyến xe có thể đăng ký từ thời điểm truy cập
 * Phương thức xử lý bất đồng bộ async/await
 * @param {Object} req- Đối tượng request
 * @param {Object} res - Đối tượng Response
 */
export async function _getAvaiableTicket(req, res, next) {
  // lấy danh sách chuyến xe còn chỗ để bắn ra cho người đăng ký
  // .populate('acount_payment.history_transaction')
  // .populate('acount_payment.history_pick_keep_seat')
  // .populate('acount_payment.history_cancel_ticket');
  try {
    const idClient = req.user._id;
    const listicket = await Ticket.find({ Customer: idClient })
      .populate({
        path: 'inChuyenXe',
        match: { timeEnd: { $gt: Date.now() } },
      })
      .populate('Customer', 'info.fullname');
    if (!listicket) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: true,
        message: 'Khong the hoan thanh thao tac banj vu yeu cau',
      });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: listicket });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    next(err);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * get thong tin chuyen
 */
export async function getInfoTicket(req, res, next) {
  const body = filteredBody(req.params, ['idve']);
  console.log('===============================');
  console.log(body);
  console.log('===============================');
  try {
    const ticket = await Ticket.findById(body.idve)
      .populate({
        path: 'inChuyenXe',
        populate: {
          path: 'routeOfTrip',
        },
      })
      .populate({
        path: 'inChuyenXe',
        populate: {
          path: 'coach',
        },
      })
      .populate('Customer', 'info.fullname');
    if (!ticket) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'LOI' });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: ticket });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
// Lọc và tìm chuyến dựa vào reactjs xử lý

/**
 * Ham xu ly cho khach hang huy ve
 * @param {req} req
 * @param {res} res
 */
export async function _putCancelTicket(req, res) {
  try {
    const ticketWasPick = await Ticket.findById(req.body.idTicket);
    ticketWasPick.isAvaiable = true;
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await ticketWasPick.save() });
  } catch (err) {
    return res
      .status(HTTPStatus.BAD_REQUEST)
      .json({ err: true, message: 'Phat sinh loi voi hanh dong cua ban' });
  }
}
/* body: idchuyenxe, idClient, comment */
export async function _putComment(req, res, next) {
  const body = filteredBody(req.body, ['idchuyen', 'comment']);
  try {
    const chuyenxe = await Chuyen.findById(body.idchuyen);
    if (!chuyenxe) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'Xuat hien loi khi truy van' });
    }
    chuyenxe.danhgia.push({
      khachhang: req.user._id,
      comment: body.comment,
      time: Date.now(),
    });
    return res
      .status(HTTPStatus.OK)
      .json({ err: false, result: await chuyenxe.save() });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}

export async function _getHistoryTransction(req, res, next) {
  try {
    const idClient = req.user._id;
    const fullInfo = await Client.findById(idClient)
      .populate('acount_payment.history_transaction')
      .populate('acount_payment.history_pick_keep_seat')
      .populate('acount_payment.history_cancel_ticket');
    if (!fullInfo) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ err: true, message: 'Loi roi' });
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: fullInfo });
  } catch (error) {
    error.status = HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
