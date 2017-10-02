/*eslint-disable */
import socketIO from 'socket.io';
import redis from 'redis';
import adapter from 'socket.io-redis';
import crypto from 'crypto';

import chuyenxeModel from './models/chuyenxe.model';
import TicketModel from './models/ticket.model';
import ClientModel from './models/client.model';
import couponModel from './models/coupons.model';

const io = socketIO();

// Ep Socket.io chi su dung duy nhat websocket. Khong su dung ket noi lau hon.
//io.set('transports', ['websocket']);

const pubClient = redis.createClient();
const subClient = redis.createClient({ return_buffers: true });

// set adapter cho socketio
io.adapter(adapter({ pubClient, subClient }));

/**
 * Có lên sử dụng session store không nhỉ?
 * Chắc không! haha đã pubsub rồi bắn store làm mẹ gì? are you ok?
 */


/**
 *  Them cac io event
 */
io.of('/client').on('connection', socket => {

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
                    socket.emit('resultPick', result);
                });
            });
        });





    })
})


export default io;
