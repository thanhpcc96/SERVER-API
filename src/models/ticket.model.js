import mongoose, { Schema } from 'mongoose';

const TicketSchema = new Schema({
    codeTicket: {
        type: String,
        unique: true
    },
    price: {
        type: Number
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
    isPayed:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('tickets',TicketSchema);