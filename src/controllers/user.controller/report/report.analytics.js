import HTTPStatus from 'http-status';

/**
 *  Hàm get doanh thu tạm thời theo ngày
 * @param {Object} req 
 * @param {Object} res 
 */
export async function _getReportRevenueDay(req, res){
 try {
     // to do something
 } catch (err) {
     return res.status(HTTPStatus.BAD_REQUEST).json({err: true, message: 'Loi phat sinh tu hanh dong cua ban'});
 }
}