import mongoose, { Schema, Error } from "mongoose";

const LotrinhSchema = new Schema(
  {
    routeOfTrip: {
      // lộ trình của chuyến, Ví dụ: Hà nội ---> Hải Phòng
      from: {
        type: String,
        required: [true, "Diem xuat phat la bat buoc"]
      },
      to: {
        type: String,
        required: [true, "Diem den cung phai bat buoc"]
      },
      lotrinh: [
        {
          type: String
        }
      ],
      giacuoc:[{
        type: Number
      }]
    },
    thoigianvanchuyen: {
      type: Number,
      default: 1,
      min: 0
    },
    vitriChotKT: [
      {
        type: String // địa phận , vị trí của chốt kiểm tra
      }
    ],
    gpxFileName: {
      type: String
    },
    xetronglotrinh: [
      {
        type: Schema.Types.ObjectId,
        ref: "coachs"
      }
    ]
  },
  { timestamps: true }
);
LotrinhSchema.index({ 'routeOfTrip.from': "text", 'routeOfTrip.end': "text", 'routeOfTrip.lotrinh': "text" });
LotrinhSchema.pre("save", function(next) {
  if (this.isModified("xetronglotrinh")) {
    if (this.xetronglotrinh.length < this.thoigianvanchuyen * 4) {
      return next(
        new Error(
          `so luong xe tham gia trong chuyen khong du toi thieu ${this
            .thoigianvanchuyen * 4}`
        )
      );
    }
  }
  return next();
});
export default mongoose.model("lotrinh", LotrinhSchema);
