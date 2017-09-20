import HTTPStatus from 'http-status';
import UserModel from '../../models/user.model';
/**
 * Hàm post Login sử dụng authencation
 * @param {Object} req 
 * @param {Object} res 
 * @param {function} next 
 */
export function _postLogin(req, res, next) {
    res.status(HTTPStatus.CONTINUE).json({ err: false, result: req.user.toAuthJSON() });
    next();
}
/**
 * Ham update thong tin user
 * @param {Object} req 
 * @param {Object} res 
 */
export async function _postUpdateInfo(req, res) {
    try {
        const id = req.user._id;
        const userCurrent = await UserModel.findById(id);
        userCurrent.password = req.body.password;
        userCurrent.info.firtname = userCurrent.info.firtname || req.body.firtname;
        userCurrent.info.lastname = userCurrent.info.lastname || req.body.lastname;
        userCurrent.info.address = userCurrent.info.address || req.body.address;
        res.status(HTTPStatus.OK).json({ err: false, result: await userCurrent.save() });
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: 'Loi he thong ' + err });
    }
}
// export function _postDangKiLichLamViec(req, res, next) {
//     try {
//         const user = req.user;
//         let role = user.role;
//         if (role === 1 && role === 2) {

//         }
//     } catch (err) {

//     }

}
