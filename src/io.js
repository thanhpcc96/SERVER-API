/*eslint-disable */
import socketIO from 'socket.io';
import redis from 'redis';
import adapter from 'socket.io-redis';
import chuyenxeModel from './models/chuyenxe.model';


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
                    socket.emit('updateListChuyenxe', {err: "Không load được list Chuyen xe"});
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

    // pick chuyen

    socket.on('pickchuyen',())
})


export default io;
