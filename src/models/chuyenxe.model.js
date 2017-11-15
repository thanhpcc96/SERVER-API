import mongoose, { Schema } from 'mongoose';

const chuyen = new Schema({
    tenchuyen: {
        type: String,
    },
    timeStart: {
        type: Date,
        required: [true, 'Thoi gian khoi hanh la bat buoc']
    },
    timeEnd: { // thoi gian du kien den ben xe
        type: Date,
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
    laixe:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
    phuxe:{
      type: Schema.Types.ObjectId,
      ref: 'users'
    },
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
    },
    danhgia:[
      {
        khachhang:{
          type: Schema.Types.ObjectId,
          ref:'clients'
        },
        comment: {
            type: String
        }
      }
    ],
    dadat:{
        type: Number,
        default: 0
    },
    vote:{
      five:Number,
      four:Number,
      three:Number,
      two:Number,
      once:Number,
    }
  }, { timestamps: true });

  chuyen.pre('save', function (next) {
    if (this.isModified('ticketsInChuyen')) {
        this.dadat = this.ticketsInChuyen.length;
    }
    return next();
});

export default mongoose.model('chuyen', chuyen);
