import mongoose, { Schema } from 'mongoose';

const chuyen = new Schema({
    sochuyen:{
        type: String,
        unique: true,
    },
    
}, { timestamps: true });