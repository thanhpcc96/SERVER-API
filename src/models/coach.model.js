import mongoose, { Schema } from 'mongoose';

const coachSchema = new Schema(
  {
    numberplate: {
      type: String,
      trim: true,
      unique: true,
    },
    seat: {
      type: Number,
      required: [true, 'Xe can phai co cho ngoi'],
      default: 0,
    },
    name: {
      type: String, // VD: Hyndai Mx01
      trim: true,
    },
    productiontime: {
      // thoi gian san xuat
      type: Date,
    },
    photo: {
      type: String,
      trim: true,
    },
    phutrach: {
      laixe: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      phuxe: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  },
  { timestamps: true },
);

coachSchema.methods = {
};

export default mongoose.model('coachs', coachSchema);
