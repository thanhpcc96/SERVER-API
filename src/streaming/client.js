/*eslint-disable */
import crypto from 'crypto';
import redis from 'redis';

import chuyenxeModel from './models/chuyenxe.model';
import TicketModel from './models/ticket.model';
import ClientModel from './models/client.model';
import couponModel from './models/coupons.model';

// const clientRedis = redis.createClient();
// const expire = 7200;



// /**
//  * Hàm xử lý load thông tin danh sách chuyến xe để 
//  * client đăng ký theo thời gian 
//  * -chuyenxe duoc luu trong redis duong dang set
//  * @return Promise
//  */
// export async function _getListChuyenXe() {
//     try {
//         const listIdchuyenxe = await clientRedis.smembers('chuyenxe');
//         console.log('===============================');
//         console.log(listIdchuyenxe);
//         console.log('===============================');
//         if (!listIdchuyenxe) {
//             return new Error('Khong co chuyen xe nao ca');
//         }
//         const returnChuyen = [];
//         const length = listIdchuyenxe.length;
//         listIdchuyenxe.forEach(key => {
//             let oneChuyen = _get1Chuyenxe(key);
//             if (oneChuyen) {
//                 returnChuyen.push(oneChuyen);
//             }
//             length--;
//             if (length === 0) {
//                 return;
//             }
//         });

//     } catch (err) {
//         return err;
//     }
//     // return new Promise((resolve, reject) => {
//     //     clientRedis.smembers('chuyenxe', (err, chuyens) => {
//     //         if (err) {
//     //             reject(err);
//     //         }
//     //         if (chuyens.length > 0) {
//     //             let length = chuyens.length;
//     //             let returnChuyen = [];
//     //             chuyens.forEach((key) => {
//     //                 _get1Chuyenxe(key).done((chuyen) => {
//     //                     returnChuyen.push(chuyen);
//     //                     length--;
//     //                     if (length === 0) {
//     //                         resolve(returnChuyen);
//     //                     }
//     //                 }, (err) => {
//     //                     reject(err)
//     //                 })
//     //             })
//     //         } else {
//     //             resolve([]);
//     //         }
//     //     })
//     // })
// }
// /**
//  * Hamd get thong tin của 1 chuyến xe
//  * Moi chuyen xe duoc luu Hashes trong redis
//  * @param {String} keyChuyen- Là objectId của chuyến xe trong mongodb sau 
//  * khi bắn vào redis
//  */
// export async function _get1Chuyenxe(keyChuyen) {
//     try {
//         const chuyenxe = await clientRedis.hgetall('chuyenxe:' + keyChuyen);
//         if (!chuyenxe) { return new Error('Khong co du lieu chuyen xe nay') };
//         const returnChuyen = {};
//         Object.key(chuyenxe).forEach(chuyen => {
//             returnChuyen.chuyen = chuyenxe[chuyen]
//         });
//         return JSON.parse(returnChuyen);
//     } catch (error) {
//         return error
//     }
//     // return new Promise((resolve, reject) => {
//     //     clientRedis.hgetall('chuyenxe:' + keyChuyen, (err, listKey) => {
//     //         if (err) reject(err);
//     //         if (listKey === null) {
//     //             reject('Chuyen xe nay khong co thong tin, Loi Logic');
//     //         }
//     //         const returnChuyenxe = {};
//     //         Object.keys(listKey).forEach(chuyen => {
//     //             returnChuyenxe.chuyen = listKey[chuyen];
//     //         });
//     //         resolve({ IDchuyen: keyChuyen, data: JSON.parse(returnChuyenxe) });
//     //     });
//     // });
// }

// export async function _pickChuyen(userID, chuyenID, chongoi, thongtinticket) {
//     try {
//         const maTicket = chuyenID + crypto.randomBytes(2).toString('hex');
//         thongtinticket.codeTicket = maTicket;
//         const client = await ClientModel.findById(userID);
//         if (!client) { return new Error() }
//         if (client.acount_payment.balance >= thongtinticket.price) {
//             client.acount_payment.balance = client.acount_payment.balance - thongtinticket.price;
//             client.acount_payment.history_transaction.push(maTicket);
//             thongtinticket.typeTicket = "DATVE";
//         }
//         else {
//             thongtinticket.typeTicket = "GIUCHO";
//             client.acount_payment.history_pick_keep_seat.push(maTicket);
//         }
//         const arrPromise = await Promise.all([
//             client.save(),
//             TicketModel.createTicket(thongtinticket, userID),
//             clientRedis.hmset('chuyenxe:' + chuyenID, { choNgoi: chongoi - 1 })
//         ]);
//         return arrPromise[1];
//     } catch (err) {
//         return err;
//     }
// }







// /**
//     return new Promise((resolve, reject) => {

//         client.multi()
//             .hmset('chuyenxe:' + chuyenID, { 'choNgoi': chongoi })
//             .exec(err => {
//                 if (err) {
//                     reject(err);
//                 } else {

//                 }
//             })

//     })
// }

//  * .sadd('ticket', maTicket)
//             .hmset('ticket:' + maTicket, {
//                 codeTicket: maTicket,
//                 price: thongtinticket.price.toString(),
//                 dateOfStart: thongtinticket.dateOfStart.toString(),
//                 routeOfTicket: thongtinticket.routeOfTicket.toString(),
//                 inChuyenXe: chuyenID,
//                 Customer: userID,
//                 coupon: thongtinticket.coupon || '',
//                 isAvaiable: thongtinticket.isAvaiable || 'false',
//                 isPay: 'false'
//             })
//             .sadd('chuyenxe:' + chuyenID + ':ve', maTicket)
//             .sadd()
//  */
export const clientSocket = io => {
    const clientIO= io.of('/client');
    clientIO.on('connection', socket => {

        const listchuyen = [];

        // load chuyen xe co the dang ky duoc tu thoi gian hien tai
        socket.on('loadchuyenxe', () => {
            chuyenxeModel.find({})
                .populate({
                    path: 'trips',
                    match: { timeStart: { $gte: Date.now() } }
                }).
                exec((err, result) => {
                    if (err) {
                        socket.emit('updateListChuyenxe', { err: "Không load được list Chuyen xe" });
                    }
                    console.log('===============================');
                    console.log(result);
                    console.log('===============================');
                    result.forEach(item => {
                        listchuyen.push(item);
                    });
                });
            socket.emit('updateListChuyenxe', listchuyen);
            socket.broadcast.emit('updateListChuyenxe', listchuyen);
        });

        socket.on('laychitietchuyen', idChuyen => {
            chuyenxeModel.findById(idChuyen)
                .populate('laixevaphuxe')
                .exec((err, result) => {
                    if (err) {
                        console.log('===============================');
                        console.log(err);
                        console.log('===============================');
                    }
                    socket.emit('chitietchuyen', result)
                });
        });

        socket.on('checkcoupon', code => {
            couponModel.findOne({ code: code }, (err, result) => {
                if (err) { return }
                if (!result) {
                    socket.emit('infoCoupon', { message: 'Coupon không tồn tại' });
                }
                if (result.begin <= Date.now() && Date.now() <= result.end && result.){
                    if (result.solanDaApdung < result.solanApdung) {
                        socket.emit('infoCoupon', result);
                    }
                    else {
                        socket.emit('infoCoupon', { message: 'Coupon đã được sử dụng hết' });
                    }
                }
                else {
                    socket.emit('infoCoupon', { message: "Coupon không có hiệu lực hoặc hết hạn!" })
                }

            })
        });

        // pick chuyen

        socket.on('timlotrinh', (tu, den) => {

        });
        /**
         * event pick chuyen xe
         */
        socket.on('pickchuyenxe', info => {
            if (!info.userID) {
                return;
            }
            const codeTicket = info.idchuyen + crypto.randomBytes(2).toString('hex');
            const newTicket = {
                codeTicket,
                dateOfStart: info.dateOfStart,
                routeOfTicket: {
                    from: info.tu,
                    to: info.den
                },
                inChuyenXe: info.idchuyen,
                Customer: info.userID,
                isAvaiable: false,
            }
            if (info.coupon) {
                couponModel.findOneAndUpdate({ code: info.coupon }, { '$set': { 'solanDaApdung': solanDaApdung + 1 } }, (err, coupon) => {
                    if (err) {
                        socket.emit('resultPick', { message: 'Có người nhanh tay hơn bạn rồi' });
                        return;
                    }
                    newTicket.price = info.price - (coupon.giamTheoLoai * info.price) / 100;
                    newTicket.coupon = coupon.code;
                });
            } else {
                newTicket.price = info.price;
                newTicket.coupon = '';
            }
            ClientModel.findById(info.userID, (err, client) => {
                if (err) { return }
                if (!client) { return }
                if (client.acount_payment.balance >= newTicket.price) {
                    client.acount_payment.balance = client.acount_payment.balance - newTicket.price;
                    client.acount_payment.history_transaction.push(codeTicket);
                    newTicket.typeTicket = "DATVE";
                    newTicket.isPayed = true;
                }
                else {
                    client.acount_payment.history_pick_keep_seat.push(codeTicket);
                    newTicket.typeTicket = "GIUCHO";
                    newTicket.isPayed = false;
                }
                client.save(err => {
                    if (err) {
                        socket.emit('resultPick', { message: 'Đặt vé không thành công' });
                        return;
                    }
                    TicketModel.create(newTicket, (err, result) => {
                        if (err) {
                            socket.emit('resultPick', { message: 'Không thể tạo vé' });
                            return;
                        }
                        chuyenxeModel.findById(info, (err, chuyenxe) => {
                            if (err) {
                                return;
                            }
                            chuyenxe.ticketsInChuyen.push(codeTicket);
                            chuyenxe.save(err => {
                                if (err) { return }
                                socket.broadcast.emit('listChuyenChanged');
                            })
                        });
                        socket.emit('resultPick', result);
                    });
                });
            });
        });
    });

    io.of('/tracking').on('connection', socket => {
        socket.on('check', chuyenxeID => {
            chuyenxeModel.findById(chuyenxeID, (err, chuyenxe) => {
                if (err) { throw err }
                if(!chuyenxe){
                    // báo cho client 
                    socket.emit('clientInChuyen',{message: 'Chuyến xe không tồn tại'})
                }else{
                    // join to chanel với Id chuyến
                    socket.join(chuyenxeID);
                }
            });
        })
    });
}