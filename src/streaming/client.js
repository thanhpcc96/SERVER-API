/*eslint-disable */
import redis from 'redis';
import crypto from 'crypto';

import TicketModel from '../models/ticket.model';
import ClientModel from '../models/client.model';

const clientRedis = redis.createClient();
const expire = 7200;



/**
 * Hàm xử lý load thông tin danh sách chuyến xe để 
 * client đăng ký theo thời gian 
 * -chuyenxe duoc luu trong redis duong dang set
 * @return Promise
 */
export function _getListChuyenXe() {
    return new Promise((resolve, reject) => {
        clientRedis.smembers('chuyenxe', (err, chuyens) => {
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
 * Moi chuyen xe duoc luu Hashes trong redis
 * @param {String} keyChuyen- Là objectId của chuyến xe trong mongodb sau 
 * khi bắn vào redis
 */
export function _get1Chuyenxe(keyChuyen) {
    return new Promise((resolve, reject) => {
        clientRedis.hgetall('chuyenxe:' + keyChuyen, (err, listKey) => {
            if (err) reject(err);
            if (listKey === null) {
                reject('Chuyen xe nay khong co thong tin, Loi Logic');
            }
            const returnChuyenxe = {};
            Object.keys(listKey).forEach(chuyen => {
                returnChuyenxe.chuyen = listKey[chuyen];
            });
            resolve({ IDchuyen: keyChuyen, data: JSON.parse(returnChuyenxe) });
        });
    });
}

export async function _pickChuyen(userID, chuyenID, chongoi, thongtinticket) {
    try {
        const maTicket = chuyenID + crypto.randomBytes(2).toString('hex');
        thongtinticket.codeTicket = maTicket;
        const client = await ClientModel.findById(userID);
        if (!client) { return new Error() }
        if (client.acount_payment.balance >= thongtinticket.price) {
            client.acount_payment.balance = client.acount_payment.balance - thongtinticket.price;
            client.acount_payment.history_transaction.push(maTicket);
            thongtinticket.typeTicket = "DATVE";
        }
        else {
            thongtinticket.typeTicket = "GIUCHO";
            client.acount_payment.history_pick_keep_seat.push(maTicket);
        }
        const arrPromise = await Promise.all([
            client.save(),
            TicketModel.createTicket(thongtinticket, userID),
            clientRedis.hmset('chuyenxe:' + chuyenID, { choNgoi: chongoi - 1 })
        ]);
        return arrPromise[1];
    } catch (err) {
        return err;
    }
}







/**
    return new Promise((resolve, reject) => {

        client.multi()
            .hmset('chuyenxe:' + chuyenID, { 'choNgoi': chongoi })
            .exec(err => {
                if (err) {
                    reject(err);
                } else {

                }
            })

    })
}

 * .sadd('ticket', maTicket)
            .hmset('ticket:' + maTicket, {
                codeTicket: maTicket,
                price: thongtinticket.price.toString(),
                dateOfStart: thongtinticket.dateOfStart.toString(),
                routeOfTicket: thongtinticket.routeOfTicket.toString(),
                inChuyenXe: chuyenID,
                Customer: userID,
                coupon: thongtinticket.coupon || '',
                isAvaiable: thongtinticket.isAvaiable || 'false',
                isPay: 'false'
            })
            .sadd('chuyenxe:' + chuyenID + ':ve', maTicket)
            .sadd()
 */