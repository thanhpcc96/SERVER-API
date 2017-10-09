import HTTPStatus from 'http-status';
import moment from 'moment';

import TicketModel from '../../../models/ticket.model';
import ChuyenxeModel from '../../../models/chuyenxe.model';

/**
 *  Hàm get doanh thu tạm thời theo ngày
 *  thống kê số lượng vé giữ chỗ, số lượng vé đặt và thanh toán
 *  Số lượng khách tham gia chuyến, chưa tham gia,..
 * @param {Object} req 
 * @param {Object} res 
 */
export async function _getReportRevenueDay(req, res) {
    try {
        const now = moment();
        /* Load ra promise voi async va await */
        const listPromise = await Promise.all([
            /* Load những vé đăng ký trong ngày */
            TicketModel.find({}).populate({
                path: 'inChuyenXe',
                match: { timeStart: { $gt: now.set({ hour: 5, minute: 0 }) } },
            }),
            /* Load những chuyến xe và thông tin từng chuyến xe trong trong ngày */
            ChuyenxeModel.find({
                timeStart: { $gt: now.set({ hour: 5, minute: 0 }) }
            }).populate('routeOfTrip')
                .populate('ticketsInChuyen'),
        ]);
    // xử lý sau

    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Loi phat sinh tu hanh dong cua ban' });
    }
}