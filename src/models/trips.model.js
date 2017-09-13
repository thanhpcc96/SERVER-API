/**
 * Model cho tung chuyen xe
 */
import mongoose, { Schema } from 'mongoose';

const Trip= new Schema({
    timeStart:{
        type: Schema.Types.Date,
        required: [true, 'Thoi gian khoi hanh la bat buoc']
    },
    timeEnd:{ // thoi gian du kien den ben xe
        type: Schema.Types.Date,
        required: [true, 'Thoi gian du kien ket thuc la bat buoc']
    },
    routeOfTrip:{ // lộ trình của chuyến, Ví dụ: Hà nội ---> Hải Phòng
        from:{
            type: String,
            required: [true, 'Diem xuat phat la bat buoc']
        },
        to:{
            type: String,
            required: [true,'Diem den cung phai bat buoc']
        }
    },
    chuyenTrongTuyen:{ // nhung chuyen xe se chay tren tuyen duong nay
        type: Schema.Types.ObjectId,
        ref: 'coachs'
    },
    thanhtrakiemtra:{ // có thanh tra kiểm tra theo từng chặng đường
        type: Schema.Types.ObjectId,
        ref:'users'
    }

},{timestamps: true});

export default mongoose.model('trips',Trip);