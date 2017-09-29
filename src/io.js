/*eslint-disable */
import socketIO from 'socket.io';


const io = socketIO();
let countClient = 0;

/**
 *  Test streaming tren defaut path '/'
 */
io.on('connection', socket => {
    countClient = countClient + 1;
    socket.emit('countlient', countClient);
});

const clients = io.of('/client').on('connection', socket => {
    socket.use((socket, next) => {
        const token = socket.request.query.token;
        
    })

    function serverError(err, message) {
        console.log(err);
        socket.emit('serverError', { message })
    }

    socket.on('loadChuyenxe', token => {

    })
})

export default io;
