import mongoose, { Schema } from 'mongoose';

const chuyen = new Schema({
    sochuyen:{
        type: String
    }
}, { timestamps: true });