import HTTPStatus from 'http-status';
import Client from '../../models/client.model';
import Ticket from '../../models/ticket.model';
import Chuyen from '../../models/chuyenxe.model.js';
import Coupon from '../../models/coupons.model';



/**
 * Phương thức get toàn bộ danh sách chuyến xe có thể đăng ký từ thời điểm truy cập
 * Phương thức xử lý bất đồng bộ async/await
 * @param {Object} req- Đối tượng request
 * @param {Object} res - Đối tượng Response
 */
export async function _getAllAvaiableChuyen(req, res) { // lấy danh sách chuyến xe còn chỗ để bắn ra cho người đăng ký
    try {
        const list = await Chuyen.find({}).populate({
            path: 'trips',
            match: { timeStart: { $gte: Date.now() } }
        });
        return res.status(HTTPStatus.OK).json({ err: false, result: list });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Xuat hien loi do hanh dong cua ban!' });
    }

}
// Lọc và tìm chuyến dựa vào reactjs xử lý
/**
 * Hàm này get thông tin của mã coupon nếu mã này tồn tại thì gửi data về cho
 * client Reactjs và RN- Được viết bởi PHẠM THÀNH
 * Hàm này bắn vào router sau thằng middleware chứng thực :))
 * @param {Object} req - đối tượng request
 * @param {Object} res - đối tượng response trả về client
 * @param {function} next - hàm callback để gọi middware khác
 * @return {function} next() - để thằng middle sau nó được thực thi
 */
export function _getCouponInfo(req, res, next) {
    Coupon.findOne({ code: req.params.code }, (err, coupon) => {
        if (err) { return next(err) }
        res.status(HTTPStatus.OK).json({ err: false, result: coupon });
        return next();
    });
}

export function _putPickTicket(req, res, next){
    
}


