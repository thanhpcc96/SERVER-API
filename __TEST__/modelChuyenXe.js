/* eslint-disable */

CHUYENXE= {
    sochuyen: {
      type: String,
      unique: true
    },
    thoigianbatdau: {
      type: Date,
      required: true
    },
    thoigianketthuc: { // thoi gian du kien den ben xe
      type: Date,
      required: true
    },
    trongTuyen: { // lộ trình của chuyến, Ví dụ: Hà nội ---> Hải Phòng
      type: ObjectId,
      ref: "TUYEN"
    },
    thanhtrakiemtra: [{ // có thanh tra kiểm tra theo từng chặng đường
        type: ObjectId,
        ref: "NHANVIEN"
      }],
    laixevaphuxe: [{
        type: ObjectId,
        ref: "NHANVIEN"
      }],
    XE: {
      type: ObjectId,
      ref: "XE"
    },
    veTrongChuyen: [
      {
        type: ObjectId,
        ref: "VE"
      }
    ],
    soChoNgoi: {
      type: Number
    },
    chieuDiChuyen: {// Chiều di chuyển đi hoặc về
      type: String,
    }
  }
