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



export default io;
