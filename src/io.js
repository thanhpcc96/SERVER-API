/*eslint-disable */
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';

import * as Client from './streaming/client';


const io = socketIO();
let countClient = 0;

/**
 *  Test streaming tren defaut path '/'
 */
io.on('connection', socket => {
    //countClient = countClient + 1;
    //socket.emit('countlient', countClient);
});

const clients = io.of('/client').on('connection', socket => {
    countClient = countClient + 1;
    socket.emit('online', countClient);

    // socket.use((socket, next) => {
    //     const token = socket.request.query.token;
    //     const info = jwt.decode(token);

    // });

    function serverError(err, message) {
        console.log(err);
        socket.emit('serverError', { message })
    }

    socket.on('loadChuyenxe', async () => {
        const list= await Client._getListChuyenXe();
        console.log('=============================================');
        console.log(list);
        console.log('=============================================');
        if(list){
            list.forEach(item=>{
                socket.emit('vote',item);
            })
        }else{
            serverError(null,'Loi me no roi');
        }
    })
});

export default io;
