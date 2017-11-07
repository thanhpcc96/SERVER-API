/*eslint-disable */
import crypto from 'crypto';
import redis from 'redis';
import socketJWT from 'socketio-jwt';

import chuyenxeModel from '../models/chuyenxe.model';
import TicketModel from '../models/ticket.model';
import ClientModel from '../models/client.model';
import couponModel from '../models/coupons.model';

import execTracking from './fakeTracking';

export const clientSocket = io => {
    const clientIO = io.of('/client');
    clientIO.on('connection', socket => {
        console.log('==============sock client=================');
        console.log('vao dk client sock');
        console.log('===============================');
        const listchuyen = [];

        // load chuyen xe co the dang ky duoc tu thoi gian hien tai
        socket.on('test', ()=>{
          ClientModel.find({},(err,result)=>{
            if(err){
              socket.emit('testok','Loi khong truy van dk');
              return;
            }
            socket.emit('testok',result);

          })
          //socket.emit('testok','vao dk test roi')
        });

        //socket.emit('testok','vao dk test roi')

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
                if (result.begin <= Date.now() && Date.now() <= result.end) {
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
        // đang làm thì mất điện
        socket.on('cancelChuyen', async (chuyenxeID, clientID, ticketID) => {
            const arrPromise = await Promise.all([
                ticketID.findById(ticketID),
                ClientModel.findById(clientID)
            ]);
            const ticketResult = arrPromise[0];
            const clientResult = arrPromise[1];

            const typeTicket = ticketResult.typeTicket;
            if (typeTicket === 'GIUCHO') {
                /* Remove vé ra khỏi lịch đặt chỗ của khách hàng */
                clientResult.acount_payment.history_pick_keep_seat.remove(ticketID);
                /* Push vé vừa hủy vảo lịch sử Hủy chuyến */
                clientIDResult.acount_payment.history_cancel_ticket.push(ticketID);
                /* Update trạng thái vé về hủy bỏ ====> Middleware sẽ auto remove vé khỏi xe */
                ticketResult.isAvaiable = true;
            }
            if (typeTicket === 'DATVE') {
                /* Remove vé ra khỏi lịch sử giao dịch của khách hàng thanh toán trước*/
                clientResult.acount_payment.history_pick_keep_seat.remove(ticketID);
                /* Push vé vừa hủy vảo lịch sử Hủy chuyến */
                clientIDResult.acount_payment.history_cancel_ticket.push(ticketID);
                /* Đồng thời hoàn lại 80% số tiền so với giá trị vé lại cho khách hành*/
                clientResult.acount_payment.balance = clientResult.acount_payment.balance + 80 * ticketResult.price / 100;
                /* Update trạng thái vé về hủy bỏ ====> Middleware sẽ auto remove vé khỏi xe */
                ticketResult.isAvaiable = true;
            }
            const arrPromiseSaved = await Promise.all([
                ticketResult.save(),
                clientResult.save(),
            ]);
            const clientAfterSave = arrPromiseSaved[1], ticketAffterSave = arrPromiseSaved[0];
            if (!clientAfterSave || ticketAffterSave) {
                socket.emit('cancelResult', { message: "Loi khong huy duoc ve" });
                return;
            }
            socket.broadcast.emit('listChuyenChanged');

        })
    });
    const clientTrackingIO = io.of("/tracking");
    clientTrackingIO.on('connection', socket => {
        socket.on('check', chuyenxeID => {
            chuyenxeModel.findById(chuyenxeID, (err, chuyenxe) => {
                if (err) { throw err }
                if (!chuyenxe) {
                    // báo cho client
                    socket.emit('locationUpdate', { message: 'Chuyến xe không tồn tại' })
                } else {
                    // join to chanel với Id chuyến
                    socket.join(chuyenxeID);
                    execTracking(clientTrackingIO, chuyenxeID);
                }
            });
        });

    });
}
