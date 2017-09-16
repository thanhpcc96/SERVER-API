import HTTPStatus from 'http-status';
import Client from '../../models/client.model';
import Ticket from '../../models/ticket.model';
import Chuyen from '../../models/chuyenxe.model.js';



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
            match: { timeStart: { $gte: new Date() } }
        });
        return res.status(HTTPStatus.OK).json({ err: false, result: list });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Xuat hien loi do hanh dong cua ban!' });
    }

}
export async function _filterAvaiableChuyen(req, res) {
    try {
        const filter= {
            theoNgay: Date.parse(req.body.theoNgay) || '',
            theoLotrinh:
        }
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Xuat hien loi tu thao tac cua ban' });
    }

}
