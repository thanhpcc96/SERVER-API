import mongoose, { Schema } from "mongoose";

const phancongSchema = new Schema({
    ngayphancong: {
        type: Date,
        default: Date.now()
    },
    khunggio: {
        type: String, // chỉ có MORNING và hoặc AFTERNOON
        default: 'MORNING'
    },
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
})