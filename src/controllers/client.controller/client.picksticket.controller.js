import HTTPStatus from 'http-status';
import Client from '../../models/client.model';
import Ticket from '../../models/ticket.model';



export function _putPickPicket(req, res, next) { // danh cho khac co tien moi dang ky dk
    try {
        const bodyDangky={
            loaiVe: req.body.type, // co ve hoac ve giu cho
            lotrinh: req.body.lotrinh,
            thoigiandi: req.body.thoigiandi
        }
        const id = req.user._id;
        if (id) {
            Client.findById(id, (err, client) => {
                if (err) { return next(err) }

            })
        }

    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Xuat hien loi do hanh dong cua ban!' });
    }

}