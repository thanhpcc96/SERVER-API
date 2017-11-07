/*eslint-disable */
import socketIO from 'socket.io';
import redis from 'redis';
import adapter from 'socket.io-redis';

import { clientSocket } from './streaming/client';

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
 *  Them cac io event client
 */
clientSocket(io);
const sl = [];
io.on('connection', socket => {
  sl.push(socket);
  console.log('===============================');
  console.log('Vao dk scoket');
  console.log('===============================');
});
io.emit('online', sl);

export default io;
