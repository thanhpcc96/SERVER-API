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
    // laixe:{
    //   type: Schema.Types.ObjectId,
    //   ref: 'users'
    // },
    // phuxe:{
    //   type: Schema.Types.ObjectId,
    //   ref: 'users'
    // },
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
        },
        time:{
          type: Date,
          default: Date.now(),
        }
      }
    ],
    dadat:{
        type: Number,
        default: 0
    },

  }, { timestamps: true });

  chuyen.pre('save', function (next) {
    if (this.isModified('ticketsInChuyen')) {
        this.dadat = this.ticketsInChuyen.length;
    }
    return next();
});
chuyen.methods={
  handlePickChuyen:{
    pickChuyen(idVe){
      this.ticketsInChuyen.push(idVe);
      this.dadat= this.dadat +1;
      return this.save();
    },
    cancelChuyen(idVe){
      if(this.ticketsInChuyen.indexOf(idVe) >=0 ){
        this.ticketsInChuyen.remove(idVe);
        this.dadat= this.dadat -1;
      };
      return this.save();
    }
  }
}
chuyen.statics={
  list({ query={}, skip= 0, limit= 5 } = {}){
      return this.find(query)
        .skip(skip)
        .limit(limit)
        .populate("routeOfTrip","routeOfTrip")
  }
}

export default mongoose.model('chuyen', chuyen);
