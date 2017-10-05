import crypto from 'crypto';
import HTTPStatus from 'http-status';

import agenda from '../../jobLoader'; // config worker */
import Client from '../../models/client.model';

/*
 ** Post Register Local
 */
/* eslint-disable-no-else-return */

export async function _getAll(req, res) {
    try {
        const list = await Client.find();
        console.log(list);
        return res.status(HTTPStatus.OK).json({ err: false ,result: list })
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({ err: true, message: " Loi" })
    }
}
/**
 * Hàm post Đăng ký
 * @param {*} req 
 * @param {*} res 
 */
export async function _postRegister(req, res) {
    try {
        const client = await Client.findOne({ "local.email": req.body.email });
        if (client) {
            return res.status(HTTPStatus.NOT_ACCEPTABLE).json({ error: true, message: 'Tai khoan nay da ton tai' })
        }

        const newClient = new Client();
        newClient.info.firstname = req.body.firstname;
        newClient.info.lastname = req.body.lastname;
        newClient.phone = req.body.phone;
        newClient.local.email = req.body.email;
        newClient.local.password = req.body.password;
        newClient.status = "ACTIVE"; // chưa kích hoạt
        return res.status(HTTPStatus.CREATED).json({ error: false, result: await newClient.save() });


    } catch (err) {
        console.log("Loi dang ky: " + err);
        return res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json({ error: true, message: 'Co loi xay ra' + err.toString() });
    }
}
/*
 ** Post Login local-- thuc thi voi dieu kien login local
 */
export function _postLogin(req, res, next) {
    res.status(200).json(req.user.toAuthJSON());
    return next();

}

export async function _getInfo(req,res){
    try {
        return res.status(HTTPStatus.OK).json({err: false; result: await Client.findById(req.params.id)});
    } catch (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({err: true, message:"Xuat hien loi tu hanh dong cua ban"});
    }
}


/*
** post forgot password
*/
export async function _postResetPassword(req, res) {
    try {

        const client = await Client.findOne({ 'local.email': req.body.email });
        if (!client) {
            return res.status(404).json({ error: true, message: 'Tài khoản không tồn tại' });
        }
        console.log('=====================================');
        console.log(client);
        console.log('=====================================');
        const resetPasswordToken = crypto.randomBytes(16).toString('hex');
        client.local.resetPasswordToken = resetPasswordToken;
        client.local.resetPasswordExpires = Date.now() + 18000000; //60*60*1000 *5/ 5 tieng
        const mailOption = {
            from: 'Hai Au copany <services.haiaucompany@gmail.com>',
            to: req.body.email,
            subject: 'Khôi phục mật khẩu',
            text: ` Xin chào ${client.info.lastname}, vui lòng nhấp vào link để đặt lại mặt khẩu của bạn:
                        http://localhost:3000/client/forgot/${resetPasswordToken}`
        }
        agenda.now('sendmail', mailOption);

        return res.status(200).json({ error: false, message: "Vui lòng check mail" });


    } catch (error) {
        console.log('=====================================');
        console.log("Lỗi ở forgot", error);
        console.log('=====================================');
    }
}
/*
* Post reset password khi co token
 */
// export async function _resetPassword(req, res) {
//     try {
//         let token = req.params.token;
//         const client = await Client.findOne({ "local.resetPasswordToken": token.trim() });
//         if (!client) {
//             return res.status(404).json({ error: true, message: "Mã xác nhận không hợp lệ" });
//         }
//         if (client.local.resetPasswordExpires < new Date()) {
//             return res.status(400).json({
//                 error: true,
//                 message: 'Mã xác nhận đã hết hạn từ ' + client.local.resetPasswordExpires
//             });
//         } else {
//             client.local.password = req.body.password;
//             return res.status(200).json({ error: false, result: await client.save() })
//         }
//     } catch (error) {
//         console.log('=====================================');
//         console.log("Lỗi ở forgot", error);
//         console.log('=====================================');
//     }
// }

/** 
* POST Update thong tin ca nhan
*/
export async function _updateInfo(req, res) {
    try {
        if (!req.client._id) {
            return res.status(400).json({ error: true, message: "Ban khong co quyen" })
        }
        const client = await Client.findById(req.client._id);
        if (!client) {
            return res.status(404).json({ error: true, message: "khong ton tai user" })
        }
        client.info.firstname = client.info.firstname || req.body.firstname;
        client.info.lastname = client.info.lastname || req.body.lastname;
        client.info.address = client.info.address || req.body.address;
        if (!req.body.email && req.body.email !== client.local.email) {
            const clientCheck = await Client.findOne({ 'local.email': req.body.email });
            if (clientCheck) return res.status(301).json({ error: true, message: "Email ton tai roi khong the them moi" })
        }
        client.local.email = client.local.email || req.body.email;
        if (client._hashPassword(req.body.oldpassword) !== client.local.password) {
            return res.status(301).json({ error: true, message: "Mat khau cu khong khop" })
        }
        client.local.password = req.body.newpassword;
        return res.status(200).json({ error: false, result: await client.save() });
    } catch (error) {
        console.log('=====================================');
        console.log("Lỗi ở forgot", error);
        console.log('=====================================');
    }
}