/*eslint-disable */
import crypto from 'crypto';
import redis from 'redis';
import socketJWT from 'socketio-jwt';
import momment from 'moment';

import chuyenxeModel from '../models/chuyenxe.model';
import TuyenModel from '../models/lotrinh.model';
import TicketModel from '../models/ticket.model';
import ClientModel from '../models/client.model';
import couponModel from '../models/coupons.model';

import execTracking from './fakeTracking';

export const clientSocket = io => {
  // const clientIO = io.of('/client');
  io.on('connection', socket => {
    console.log('==============sock client=================');
    console.log('vao dk client sock');
    console.log('===============================');
    /* Biến lưu trữ mảng chuyến xe ===> khi load socket sẽ rất nhanh không cần gọi tới callback */
    let listchuyen = [];

    /* Test socket */
    socket.on('test', () => {
      ClientModel.find({}, (err, result) => {
        if (err) {
          socket.emit('testok', 'Loi khong truy van dk');
          return;
        }
        socket.emit('testok', result);
      });
    });

    /* Load chuyến xe có thể đăng ký */
    socket.on('loadchuyenxe', async ClientID => {
      console.log('===============================');
      console.log(' on loadchuyenxe ', ClientID);
      console.log('===============================');
      try {
        if (listchuyen.length > 0) {
          socket.emit('updateListChuyenxe', {
            type: 'GET_LIST_CHUYEN_SUCCESS',
            listchuyen,
          });
        }
        // const userID= await TicketModel.find({Customer : ClientID})
        //                       .populate({
        //                         path: "inChuyenXe",
        //                         match: { timeStart: { }}                              })
        //      .
        const result = await chuyenxeModel
          .find({
            //timeStart: { $gte: momment().subtract(2, 'day') },
            timeStart: { $gte: momment().add(30, 'minute') },
          })
          .populate('routeOfTrip', 'routeOfTrip.lotrinh')
          .populate({
            path: 'ticketsInChuyen',
            //match: { "Customer" : { $ne : ClientID }}
          });
        if (!result) {
          socket.emit('updateListChuyenxe', {
            type: 'GET_LIST_CHUYEN_ERR',
            error: 'Khong load duoc',
          });
        }
        listchuyen = result;
        let timeTemp;
        for (let i = 0; i < listchuyen.length; i++) {
          for (let j = 0; j < listchuyen[i].ticketsInChuyen.length; j++) {
            if (
              listchuyen[i].ticketsInChuyen[j].Customer.toString() === ClientID
            ) {
              timeTemp = listchuyen[i].timeStart;
              //listchuyen.splice(i, 1);
            }
          }
        }
        const chuyensaufillter = [];
        for (let i = 0; i < listchuyen.length; i++) {
          if (
            momment(timeTemp).add(4, 'hour') < momment(listchuyen[i].timeStart)
          ) {
            chuyensaufillter.push(listchuyen[i]);
          }
        }
        console.log('=============chuyensaufillter.length==================');
        console.log(chuyensaufillter.length);
        console.log('===============================');
        socket.emit('updateListChuyenxe', {
          type: 'GET_LIST_CHUYEN_SUCCESS',
          result: chuyensaufillter,
        });
        socket.broadcast.emit('updateListChuyenxe', {
          type: 'GET_LIST_CHUYEN_SUCCESS',
          result: chuyensaufillter,
        });
      } catch (err) {
        socket.emit('updateListChuyenxe', {
          type: 'GET_LIST_CHUYEN_ERR',
          error: 'Loi ' + err,
        });
      }
    });
    /** Tìm kiếm chuyến xe */
    socket.on('timkiem', async query => {
      try {
        //if (listchuyen.length == 0) {
        const result = await chuyenxeModel
          .find({
            timeStart: {
              $lte: query.timeStart || momment(),
              $gt: momment()
                .add(1, 'day')
                .set({ hour: 7, minute: 0 }),
            },
          })
          .populate({
            path: 'routeOfTrip',
            select: 'routeOfTrip',
            options: {
              $text: { $search: query.textSearch },
            },
          });
        /** http://mongoosejs.com/docs/api.html#querystream_QueryStream */
        if (!result) {
          socket.emit('resultSearch', {
            type: 'RESULT_SEARCH_ERROR',
            error: 'Ko Tim duoc ket qua',
          });
        }
        socket.emit('resultSearch', {
          type: 'RESULT_SEARCH_SUCCESS',
          result,
        });
        //}
        // } else{
        //       /** sử dụng regex của javascript để tìm kiếm gần đúng  */
        //     const userRegex = new RegExp(`${query.textSearch}|${query.textSearch.toUpperCase()}|${query.textSearch.toLowerCase()} `, 'gi');
        //     console.log('===============================');
        //     console.dir(listchuyen[0]);
        //     console.log('===============================');
        //     const kqSearch = [];
        //     listchuyen.forEach(chuyen => {
        //       chuyen.routeOfTrip.routeOfTrip.lotrinh.forEach(lotrinh => {
        //         console.log('===============================');
        //         console.log(lotrinh);
        //         console.log('===============================');
        //         if (userRegex.test(lotrinh)) {
        //           kqSearch.push(chuyen);
        //           //return;
        //         }
        //       });
        //     });

        //     socket.emit('resultSearch', {
        //       type: 'RESULT_SEARCH_SUCCESS',
        //       kqSearch,
        //     });
        // }
      } catch (err) {
        socket.emit('resultSearch', {
          type: 'RESULT_SEARCH_ERROR',
          error: err,
        });
      }
    });
    /** Load chi tiet chuyen */
    socket.on('chuyenDetail', async idChuyen => {
      console.log('===============================');
      console.log('chuyen detail ', idChuyen);
      console.log('===============================');
      try {
        const ketqua = await chuyenxeModel
          .findById(idChuyen)
          .populate(
            'laixe',
            'info',
          ) /** populate field laixe and select fieil info of userSchema */
          .populate('phuxe', 'info')
          .populate('routeOfTrip', 'routeOfTrip');
        if (!ketqua) {
          socket.emit('chuyenDetailResult', {
            type: 'GET_CHUYEN_DETAIL_ERROR',
            error: new Error('Khong load duoc chi tiet chuyen'),
          });
          return;
        }
        socket.emit('chuyenDetailResult', {
          type: 'GET_CHUYEN_DETAIL_SUCCESS',
          result: ketqua,
        });
      } catch (err) {
        socket.emit('chuyenDetailResult', {
          type: 'GET_CHUYEN_DETAIL_ERROR',
          error: err,
        });
      }
    });

    socket.on('timlotrinh', async info => {});

    socket.on('tinhtien', async info => {
      console.log('===============================');
      console.log('Thực hiện tính tiền vé cho khách');
      console.log('===============================');
      try {
        const { idTuyen, diemlen, diemxuong } = info;
        const tuyenResult = await TuyenModel.findById(idTuyen);
        const indexOfDiemLen = tuyenResult.routeOfTrip.lotrinh.indexOf(diemlen);
        const indexOfDiemXuong = tuyenResult.routeOfTrip.lotrinh.indexOf(
          diemxuong,
        );
        let giacuoc = 0;
        if (indexOfDiemLen < indexOfDiemXuong) {
          for (let i = indexOfDiemLen; j < indexOfDiemXuong; i++) {
            giacuoc += tuyenResult.routeOfTrip.giacuoc[i];
          }
        }
        if (indexOfDiemLen > indexOfDiemXuong) {
          for (let i = indexOfDiemXuong; j > indexOfDiemLen; i--) {
            giacuoc += tuyenResult.routeOfTrip.giacuoc[i];
          }
        }
        socket.emit('tinhgiaResult', {
          type: 'TINH_GIA_THANH_CONG',
          result: giacuoc,
        });
      } catch (error) {
        socket.emit('tinhgiaResult', { type: 'TINH_GIA_THAT_BAI', error });
      }
    });

    /** pick chuyen -- dang ki ve xe */
    socket.on('pickchuyenxe', async info => {
      console.log('================thong tin pick chuyen===============');
      console.log(info);
      console.log('===============================');
      if (!info.userid) {
        return;
      }
      const codeTicket =
        info.idchuyen +
        crypto
          .randomBytes(2)
          .toString('hex')
          .toUpperCase();
      const ticket = {
        codeTicket,
        dateOfStart: info.dateOfStart,
        routeOfTicket: {
          from: info.tu,
          to: info.den,
        },
        inChuyenXe: info.idchuyen,
        Customer: info.userid,
        isAvaiable: false,
        price: info.price,
      };

      const client = await ClientModel.findById(info.userid);
      if (!client) {
        return;
      }
      const chuyenXe = await chuyenxeModel.findById(info.idchuyen);

      const newTicket = await TicketModel.createTicket(ticket, info.userid);
      if (client.acount_payment.balance >= newTicket.price) {
        client.acount_payment.balance =
          client.acount_payment.balance - newTicket.price;
        client.acount_payment.history_transaction.push(newTicket._id);
        newTicket.typeTicket = 'DATVE';
        newTicket.isPayed = true;
      } else {
        client.acount_payment.history_pick_keep_seat.push(newTicket._id);
        newTicket.typeTicket = 'GIUCHO';
        newTicket.isPayed = false;
      }
      const arrPromise = await Promise.all([
        client.save(),
        newTicket.save(),
        chuyenXe.handlePickChuyen.pickChuyen(newTicket._id),
      ]);
      //const kqClientSave= arrPromise[0];
      const kqTicketCreate = arrPromise[1];
      const updateChuyen = arrPromise[2];
      if (!kqTicketCreate) {
        socket.emit('pickResult', {
          type: 'BOOK_CHUYEN_ERROR',
          error: new Error('Loi! pick chuyen khong thanh cong'),
        });
        return;
      }
      socket.emit('pickResult', {
        type: 'BOOK_CHUYEN_SUCCESS',
        result: kqTicketCreate,
      });
      socket.broadcast.emit('listChuyenChanged', {
        idChuyen: updateChuyen._id,
        dadat: updateChuyen.dadat,
      });
      console.log('===============================');
      console.log(listchuyen.length);
      console.log('===============================');
      //listchuyen = [];
    });

    /** Cancel chuyen */
    socket.on('cancelChuyen', async info => {
      const { chuyenxeID, clientID, ticketID } = info;
      console.log(
        '==============cancel chuyencancel chuyencancel chuyencancel chuyencancel chuyen=================',
      );
      console.log('cancel chuyen', info);
      console.log('===============================');
      const arrPromise = await Promise.all([
        TicketModel.findById(ticketID),
        ClientModel.findById(clientID),
        chuyenxeModel.findById(chuyenxeID),
      ]);
      const ticketResult = arrPromise[0];
      const clientResult = arrPromise[1];
      const chuyenResult = arrPromise[2];

      const typeTicket = ticketResult.typeTicket;
      if (typeTicket === 'GIUCHO') {
        /* Remove vé ra khỏi lịch đặt chỗ của khách hàng */
        clientResult.acount_payment.history_pick_keep_seat.remove(ticketID);
        /* Push vé vừa hủy vảo lịch sử Hủy chuyến */
        clientResult.acount_payment.history_cancel_ticket.push(ticketID);
        /* Update trạng thái vé về hủy bỏ ====> Middleware sẽ auto remove vé khỏi xe */
        ticketResult.isAvaiable = true;
      }
      if (typeTicket === 'DATVE') {
        /* Remove vé ra khỏi lịch sử giao dịch của khách hàng thanh toán trước*/
        clientResult.acount_payment.history_pick_keep_seat.remove(ticketID);
        /* Push vé vừa hủy vảo lịch sử Hủy chuyến */
        clientResult.acount_payment.history_cancel_ticket.push(ticketID);
        /* Đồng thời hoàn lại 80% số tiền so với giá trị vé lại cho khách hành*/
        clientResult.acount_payment.balance =
          clientResult.acount_payment.balance + 80 * ticketResult.price / 100;
        /* Update trạng thái vé về hủy bỏ ====> Middleware sẽ auto remove vé khỏi xe */
        ticketResult.isAvaiable = true;
      }
      const arrPromiseSaved = await Promise.all([
        ticketResult.save(),
        clientResult.save(),
        chuyenResult.handlePickChuyen.cancelChuyen(ticketID),
      ]);
      const clientAfterSave = arrPromiseSaved[1],
        ticketAffterSave = arrPromiseSaved[0];
      if (!clientAfterSave || !ticketAffterSave) {
        socket.emit('cancelResult', {
          type: 'CANCEL_CHUYEN_ERROR',
          error: new Error('Co loi xay ra, vui long thu lai'),
        });
        return;
      }
      socket.emit('cancelResult', {
        type: 'CANCEL_CHUYEN_SUCCESS',
        message: 'huy dang ky chuyen thanh cong',
      });
      socket.broadcast.emit('listChuyenChanged');
      listchuyen = [];
    });
  });

  // đang làm thì mất điện
  const clientTrackingIO = io.of('/tracking');
  clientTrackingIO.on('connection', socket => {
    socket.on('check', chuyenxeID => {
      chuyenxeModel.findById(chuyenxeID, (err, chuyenxe) => {
        if (err) {
          throw err;
        }
        if (!chuyenxe) {
          // báo cho client
          socket.emit('locationUpdate', { message: 'Chuyến xe không tồn tại' });
        } else {
          // join to chanel với Id chuyến
          socket.join(chuyenxeID);
          execTracking(clientTrackingIO, chuyenxeID);
        }
      });
    });
  });
};
