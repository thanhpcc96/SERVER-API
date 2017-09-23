import mongoose, { Schema } from 'mongoose';

const LotrinhSchema = new Schema({
    routeOfTrip: { // lộ trình của chuyến, Ví dụ: Hà nội ---> Hải Phòng
        from: {
            type: String,
            required: [true, 'Diem xuat phat la bat buoc']
        },
        to: {
            type: String,
            required: [true, 'Diem den cung phai bat buoc']
        },
        lotrinh: {
            type: String,
            require: [true, "Lotrinh xe la bat buoc"]
        }
    },
    vitriChotKT:[
        {
            type: String // địa phận , vị trí của chốt kiểm tra
        }
    ]
}, { timestamps: true });