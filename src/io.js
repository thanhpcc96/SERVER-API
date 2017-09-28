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
    cl
})

export default io;
