import HTTPStatus from 'http-status';
import Joi from 'joi';

import Ticket from '../../models/ticket.model';
import Chuyen from '../../models/chuyenxe.model.js';
import Client from '../../models/client.model';


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
                                  });
    if(!listicket){
      return res.status(HTTPStatus.BAD_REQUEST).json({error: true, message:"Khong the hoan thanh thao tac banj vu yeu cau"});
    }
    return res.status(HTTPStatus.OK).json({ err: false, result: listicket });
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    next(err);
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
export async function _putComment(req, res, next){
  try {
    const chuyenxe = await Chuyen.findById()
  } catch (error) {
    error.status= HTTPStatus.BAD_REQUEST;
    next(error);
  }
}
