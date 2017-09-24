import mongoose, { Schema } from 'mongoose';

const chuyen = new Schema({
    sochuyen: {
        type: String,
        unique: true,
    },
    timeStart: {
        type: Schema.Types.Date,
        required: [true, 'Thoi gian khoi hanh la bat buoc']
    },
    timeEnd: { // thoi gian du kien den ben xe
        type: Schema.Types.Date,
        required: [true, 'Thoi gian du kien ket thuc la bat buoc']
    },
    routeOfTrip: { // lộ trình của chuyến, Ví dụ: Hà nội ---> Hải Phòng
        type: Schema.Types.ObjectId,
        ref: 'lotrinh'
    },
    thanhtrakiemtra: [{ // có thanh tra kiểm tra theo từng chặng đường
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    laixevaphuxe: [
        {
            type: Schema.type.ObjectId,
            ref: 'users'
        }
    ],
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'coachs'
    },
    ticketsInChuyen: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tickets'
        }
    ],
    choNgoi: {
        type: Number,
        min: 0
    },
    tinhtrang: [

    ],
    loai: {
        type: String, // di ve ve
        default: "DI"
    }
}, { timestamps: true });

export default mongoose.model('chuyen', chuyen);