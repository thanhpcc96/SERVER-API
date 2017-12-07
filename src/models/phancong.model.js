import mongoose, { Schema } from 'mongoose';
import moment from 'moment';

/**
 * Theo logic thì mỗi người lái xe và phụ xe sẽ làm việc 1ngày,
 * 1 tuần sẽ có 1 ngày nghỉ tùy chọn
 */
const phancongSchema = new Schema(
  {
    ngayphancong: {
      type: Date,
      required: [true, 'Lich la bat buoc'],
      unique: true,
    },
    tuyenxe: String,
    phancong: [
      {
        bienso: String,
        laixe: String,
        phuxe: String,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('phancong', phancongSchema);
