/*
** tu dong refesh lai so cho ngoi, chuyen theo ngay
*/
/* eslint-disable*/
import moment from 'moment';

import chuyenxeModel from '../models/chuyenxe.model.js'
import phancongModel from '../models/phancong.model';
import lotrinhModel from '../models/lotrinh.model'



export default function refeshSeat(agenda) {
    agenda.define("refeshseat", (job, done) => {

    });
};
//config chuyen xe cứng
const lichtrinhDi = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const chongoi = 80;

const phancong = async (done) => {
    listLotrinh = await lotrinhModel.find();
    if (!listLotrinh) { return done(new Error("Khong the thuc hien task vu nay")); }
    const chuyenArr = [];
    for (let i = 0; i < listLotrinh.length; i++) {
        for (let j = 0; j < lichtrinhDi.length; j++) {
            const time = moment();
            let chuyenDi = {
                sochuyen: `${listLotrinh[i].routeOfTrip.from}-${listLotrinh[i].routeOfTrip.to}:${lichtrinhDi[j]} `,
                timeStart: time.set({ hour: lichtrinhDi[j], minute: 0 }),
                timeEnd: time.set({ hour: lichtrinhDi[j] + listLotrinh[i].thoigianvanchuyen, minute: 0 }),
                routeOfTrip: listLotrinh[i]._id,
                thanhtrakiemtra: [],
                laixevaphuxe: [],
                coach: '',
                ticketsInChuyen: [],
                choNgoi: chongoi,
                tinhtrang: [],
                loai: "DI"
            }
            chuyenArr.push(chuyenDi);
            if (j !== lichtrinhDi.length - 1) {
                let ChuyenVe = {
                    sochuyen: `${listLotrinh[i].routeOfTrip.to}-${listLotrinh[i].routeOfTrip.from}:${time.set({ minute: 30 })} `,
                    timeStart: time.set({ minute: 30 }), // Cứ sau chuyến đi về bến 30p thì thực hiện Chuyến lượt về
                    timeEnd: time.set({ hour: lichtrinhDi[j] + 2 * listLotrinh[i].thoigianvanchuyen, minute: 30 }),
                    routeOfTrip: listLotrinh[i]._id,
                    thanhtrakiemtra: [],
                    laixevaphuxe: [],
                    coach: '',
                    ticketsInChuyen: [],
                    choNgoi: chongoi,
                    tinhtrang: [],
                    loai: "VE"
                }
                chuyenArr.push(ChuyenVe)
            }

        }
    }
    const listChuyen = await chuyenxeModel.insertMany(chuyenArr);
}