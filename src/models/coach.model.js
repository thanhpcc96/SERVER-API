import mongoose, { Schema } from 'mongoose';

const coachSchema= new Schema({
    numberplate:{
        type: String,
        trim: true,
        unique: true
    },
    seat:{
        type: Number,
        required: [true,'Xe can phai co cho ngoi'],
        default: 0
    },
    name:{
        type: String,// VD: Hyndai Mx01
        trim: true
    },
    productiontime:{ // thoi gian san xuat
        type: Date,
    },
    kind:{
        type: Number, // 1 xe vip, 2 xe thuong
        required: true,
        default: 2
    },
    photo:{
        type: String,
        trim: true
    }
},{timestamps: true});

export default mongoose.model(coach,coachSchema);
