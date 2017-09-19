import HTTPStatus from 'http-status'
import User from '../../../models/user.model';
/**
 * Hàm thực hiện load danh sách user
 * Chỉ quản lý nhân sự và Người có quyên cao hơn được phép 
 * Thực hiện quyền này
 * @param {Object} req 
 * @param {Object} res 
 */
export async function _getAllUser(req, res) {
    try {
        const user = req.user;
        if (user.role !== 1 || user.role !== 2) {
            return res.status(HTTPStatus.FORBIDDEN).json({ err: true, message: "Ban khong co quyen lam thuc hien chuc nang nay" });
        }
        const listUser = await User.find({ role: { $gt: 2 } });
        if (!listUser) {
            return res.status(HTTPStatus.NOT_FOUND).json({ err: true, message: "Xuat hien loi khi thuc hien yeu cau" });
        }
        return res.status(HTTPStatus.OK).json({ err: false, result: listUser });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: "Loi tu yeu cau cua ban" });
    }
}