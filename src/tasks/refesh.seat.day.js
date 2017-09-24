/*
** tu dong refesh lai so cho ngoi, chuyen theo ngay
*/
/* eslint-disable*/
import moment from 'moment';
import tripModel from '../models/trips.model';
import phancongModel from '../models/phancong.model';
import lotrinhModel from '../models/lotrinh.model'



export default function refeshSeat(agenda) {
    agenda.define("refeshseat", (job, done) => {

    });
};

const lichtrinh = [6, 9, 12, 15, 17, 19];
const phancong = async (done) => {
    listLotrinh = await lotrinhModel.find();
    if (!listLotrinh) { return done(new Error("Khong the thuc hien task vu nay")); }
    const TripArr = [];
    for (let i = 0; i < listLotrinh.length; i++) {
        for (let j = 0; j < lichtrinh.length; j++) {
            const time = moment();
            let tripDi = {
                timeStart: time.set({ hour: lichtrinh[j], minute: 0 }),
                timeEnd: time.set({ hour: lichtrinh[j] + 3, minute: 0 }),
                routeOfTrip: listLotrinh[i]._id,
                chuyenTrongTuyen: [],
                thanhtrakiemtra: [],
                loai: "DI"
            }
            TripArr.push(tripDi);
            if (j !== lichtrinh.length - 1) {
                let tripVe = {
                    timeStart: time.set({ minute: 30 }), // Cứ sau chuyến đi về bến 30p thì thực hiện Chuyến lượt về
                    timeEnd: time.set({ hour: lichtrinh[j] + 5, minute: 30 }),
                    routeOfTrip: listLotrinh[i]._id,
                    chuyenTrongTuyen: [],
                    thanhtrakiemtra: [],
                    loai: "VE"
                }
                TripArr.push(tripVe)
            }

        }
    }
    await tripModel.insertMany(TripArr);
    // tao tuyen xe
    

}