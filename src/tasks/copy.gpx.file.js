import fs from 'fs';
import moment from 'moment';

import chuyenxeModel from '../models/chuyenxe.model';

export default function copyGPXfile(agenda) {
    agenda.define('copyfile', async (job, done) => {

        const now = moment();
        const arrName = await chuyenxeModel.find({
            timeStart: { $gt: now.set({ hour: 0, minute: 5 }), $lt: now.set({ hour: 20, minute: 30 }) }
        })
            .populate('routeOfTrip')
            .exec((err, result) => {
                if (err) { return done(new Error("khong tim thay chuyen xe ma coppy")) }
                result.forEach(item => {
                    /* Lấy tên chuyến xe bắn vào obj làm tên file gpx */
                    const obj = {
                        filename: item.sochuyen,
                        lotrinh: item.routeOfTrip.gpxFileName
                    }
                    arrName.push(obj);
                });
            });
        /* Xoa het file gpx trong thu muc cu */
        fs.readdir('../streaming/gpx-data/', (e, filenames) => {
            if (e) {
                return done(new Error("khong the xoa het file lo trinh cu"));
            }
            filenames.forEach(filename => {
                /* xóa file */
                fs.unlink(`../streaming/gpx-data/${filename}`, error => {
                    if (error) {
                        return;
                    }
                });
            });
        });
        /* Đọc file lịch trình gốc */
        fs.readdir('gpxLichtrinh/',(err, filenames)=>{
            if(err){ return done(new Error('khong the load file lich trinh goc'))}
            filenames.forEach(filename=>{
                /* Tạo stream đọc file và copy bằng cách pipe vào luồng ghi file */
                const data= fs.createReadStream(`gpxLichtrinh/${filename}`,{
                    encoding: 'utf8',
                });
                /* So sánh nhừng chuyến nào có lộ trình giống tên file thì coppy */
                arrName.forEach(item=>{
                    if(item.lotrinh===filename){
                        data.pipe(fs.createWriteStream(`../streaming/gpx-data/${item.filename}.gpx`))
                    }
                });
            });
        });
       // return done();
    });
}
