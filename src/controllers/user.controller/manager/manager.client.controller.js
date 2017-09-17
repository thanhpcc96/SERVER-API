import HTTPStatus from 'http-status';
import Client from '../../../models/client.model';



/**
 * Hàm xử lý bất đồng bộ,
 * Nếu quyền là Admin, quản lý thì có quyền
 * load hết thông tin hành khách ra
 * @param {Object} req - đối tượng request
 * @param {Object} res - đối tượng response
 */
export async function _getAllClient(req, res) {
    try {
        const user = req.user;
        if (user.role !== 1 && user.role !== 2) {
            return res.status(HTTPStatus.FORBIDDEN).json({ err: true, message: "Ban khong co quyen truy cap chuc nang nay!" });
        }
        return res.status(HTTPStatus.OK).json({ err: false, result: await Client.find({}) });

    } catch (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: "Phat sinh loi tu hanh dong cua ban" });
    }
}
/**
 * Hàm bất đồng bộ
 * Xóa khách hàng theo list,
 * còn điều kiện lọc thực hiện ở phía client
 * @param {Object} req - Request object-- client gửi lên
 * @param {Object} res- Response object -- gửi về client
 */
export async function _deleteClient(req, res) {
    try {
        const user = req.user;
        if (user.role !== 1 && user.role !== 2) {
            return res.status(HTTPStatus.FORBIDDEN).json({ err: true, message: "Ban khong co quyen truy cap chuc nang nay!" });
        }
        const listClientToDel = JSON.stringify(req.body.listClient);
        return res.status(HTTPStatus.OK).json({ err: false, result: await Client.findByIdAndRemove(listClientToDel) });
    }
    catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: "Phat sinh loi tu hanh dong cua ban" });
    }
}
/**
 * Hàm xử lý giao dịch nạp tiền tài khoản của
 * khách hàng có lưu lại lịch sử giao dịch
 * @param {Object} req - đối tượng request
 * @param {Object} res - đối tượng response
 */
export async function _putRechairCoin(req, res) {
    try {
        const user = req.user;
        if (user.role !== 1 && user.role !== 2) {
            return res.status(HTTPStatus.FORBIDDEN).json({ err: true, message: "Ban khong co quyen truy cap chuc nang nay!" });
        }
        const client = await Client.findById(req.body.clientID);
        if (!client) {
            return res.status(HTTPStatus.NOT_FOUND).json({ err: true, message: 'Khach hang khong ton tai' });
        }
        const oldBalace = client.acount_payment.balance
        client.acount_payment.balance = oldBalace + parseInt(req.body.amount, 0);
        client.acount_payment.history_recharge.push({
            rechargeTime: Date.now(),
            idUser: user._id, // Id nhan vien nhan tien
            nameUser: user.fullname,
            amountSend: parseInt(req.body.amount, 0),
            oldBalace
        });
        return res.status(HTTPStatus.OK).json({ err: false, result: await client.save() });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: "Phat sinh loi tu hanh dong cua ban" });
    }
}
/**
 * Hàm lấy ra những danh sách những vé mà 1 khách hàng đã đặt
 * @param {Object} req 
 * @param {Object} res 
 */
export async function _getAllTicketOfClient(req, res) {
    try {
        const kq = await Client.findById(req.body.id).populate({
            path: "acount_payment.history_transaction",
            model: "tickets"
        });
        return res.status(HTTPStatus.OK).json({ err: false, result: kq });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: "Phat sinh loi tu yeu cau cua bạn" });
    }

}