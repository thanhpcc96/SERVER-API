/*eslint-disable */
import redis from 'redis';
import crypto from 'crypto';

import ChuyenxeModel from '../models/chuyenxe.model';

const client = redis.createClient();
const expire = 7200;
/**
 * Hàm xử lý load thông tin danh sách chuyến xe để 
 * client đăng ký theo thời gian thực
 * @return Promise
 */
export function _getListChuyenXe() {
    return new Promise((resolve, reject) => {
        client.smembers('chuyenxe', (err, chuyens) => {
            if (err) {
                reject(err);
            }
            if (chuyens.length > 0) {
                let length = chuyens.length;
                let returnChuyen = [];
                chuyens.forEach((key) => {
                    _get1Chuyenxe(key).done((chuyen) => {
                        returnChuyen.push(chuyen);
                        length--;
                        if (length === 0) {
                            resolve(returnChuyen);
                        }
                    }, (err) => {
                        reject(err)
                    })
                })
            } else {
                resolve([]);
            }

        })
    })
}
/**
 * Hamd get thong tin của 1 chuyến xe
 * @param {String} keyChuyen- Là objectId của chuyến xe trong mongodb sau 
 * khi bắn vào redis
 */
export function _get1Chuyenxe(keyChuyen) {
    return new Promise((resolve, reject) => {
        client.get(keyChuyen, (err, chuyen) => {
            if (err) {
                reject(err);
            }
            if (chuyen === null) {
                reject('Khong co thong tin chuyen xe nay');
            }
            resolve({ idChuyen: keyChuyen, thongtin: JSON.parse(chuyen) });
        })
    });
}

export function _pickChuyen(userID, chuyenID, chongoi) {
    return new Promise((resolve, reject) => {
        const maTicket = chuyenID + crypto.randomBytes(2).toString('hex');
        client.multi()
            .setex('chuyenxe:' + chuyenID + ':chongoi', expire, chongoi--)
            .sadd('chuyenxe:' + chuyenID + ':ve:', maTicket)
            .sadd('chuyenxe:'+chuyenID+':user:',userID)
            .expire()
    })
}