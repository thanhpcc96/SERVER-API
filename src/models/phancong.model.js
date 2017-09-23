import mongoose, { Schema } from "mongoose";

/**
 * Theo logic thì mỗi người lái xe và phụ xe sẽ làm việc 1ngày,
 * 1 tuần sẽ có 1 ngày nghỉ tùy chọn
 */
const phancongSchema = new Schema({
    ngayphancong: {
        type: Date,
        default: Date.now()
    },
    // khunggio: {
    //     type: String, // chỉ có MORNING và hoặc AFTERNOON
    //     default: 'MORNING'
    // },
    trips: {
        type: Schema.Types.ObjectId,
        ref: 'trips'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    coach: {
        type: Schema.Types.ObjectId,
        ref: 'coachs'
    }
},{timestamps: true});

export default mongoose.model('phancong',phancongSchema);