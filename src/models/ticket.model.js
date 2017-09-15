import mongoose, { Schema } from 'mongoose';

const TicketSchema = new Schema({
    codeTicket: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        min:0
    },
    dateOfStart: {
        type: Date
    },
    routeOfTicket: { // lộ trình của vé xe: ví dụ: Hải dương---> Hà Nội thì đi xe Hà Nội--> Hải phòng
        from: {
            type: String,
        },
        to: {
            type: String
        }
    },
    inCoach:{
        type: Schema.Types.ObjectId,
        ref: 'coachs'
    },
    Customer: {
        type: Schema.Types.ObjectId,
        ref: 'clients'
    },
    coupon:{
        type: Schema.Types.ObjectId,
        ref:'coupons'
    },
    isPayed:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });


// TicketSchema.methods={
//  /**
//   * Update tien khi add conpoun
//   */
//   _UpdatePriceWithCoupon(){
      
//   }
// }

export default mongoose.model('tickets',TicketSchema);