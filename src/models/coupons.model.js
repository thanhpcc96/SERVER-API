import mongoose, {Schema} from 'mongoose';

const coupons= new Schema({
    code:{
        type:String,
        required:[true,'Ma la rat can thiet'],
        unique: true,
        index: true
    },
    giamTheoLoai:{
        donvi:{
            type:String,
            default:'tien',// phan tram,....
        },
        giatri:{
            type:Number,
            min: 0,
            default:0
        }
    },
    begin:{
        type: Date,
        require: [true, 'Can co thoi han su dung']
    },
    end:{
        type: Date,
        required:[true, 'Can co thoi han ket thuc']
    },
    solanApdung:{
        type: Number,
        min:1,
        default:1
    },
    isEndable:{
        type: Boolean,
        default: false
    }    
},{timestamps: true});



export default mongoose.model('coupons', coupons);