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
    lotrinh: {
        from: {
            type: String,
        },
        to: {
            type: String
        }
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