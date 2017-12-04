import mongoose, { Schema } from 'mongoose';

const ActivityLog = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    action: {
      name: {
        type: String, // LOẠI HÀNH ĐỘNG:
      },
      detail:[],
    },
    time:{
      type: Date,
      default: Date.now()
    },
    status: {
      type: String,
      require: [true, 'có trạng thái chứ'],
    },
  },
  { timestamps: true },
);
export default mongoose.model('Recordlog', ActivityLog);
