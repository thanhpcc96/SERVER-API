import mongoose, { Schema } from 'mongoose';
import ChuyenxeModel from './chuyenxe.model';

const TicketSchema = new Schema(
  {
    codeTicket: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    dateOfStart: {
      type: Date,
      default: Date.now()
    },
    routeOfTicket: {
      // lộ trình của vé xe: ví dụ: Hải dương---> Hà Nội thì đi xe Hà Nội--> Hải phòng
      from: {
        type: String,
      },
      to: {
        type: String,
      },
    },
    inChuyenXe: {
      type: Schema.Types.ObjectId,
      ref: 'chuyenxe',
    },
    Customer: {
      type: Schema.Types.ObjectId,
      ref: 'clients',
    },
    isAvaiable: {
      // Ve nay co bi huy khong? true hoac false // true la bi huy ve
      type: Boolean,
      default: false,
    },
    typeTicket: {
      type: String,
      default: 'GIUCHO',
    },
    isPayed: {
      type: Boolean,
      default: false,
    },
    isDoneCheck:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

TicketSchema.pre('save', function(next) {
  if (this.isModified('isAvaiable')) {
    if (this.isAvaiable === true) {
      this._removeTicketFromChuyenXe();
    }
  }
  return next();
});

TicketSchema.methods = {
  /**
     *  Ham xu ly hanh dong khach hang huy chuyen xe
     */
  _removeTicketFromChuyenXe() {
    ChuyenxeModel.findById(this.inChuyenXe, (err, result) => {
      if (err) {
        return;
      }
      if (result.ticketsInChuyen.indexOf(this._id)) {
        result.ticketsInChuyen.remove(this._id);
        result.save(error => {
          if (error) {
            return;
          }
        });
      }
    });
  },
};

TicketSchema.statics = {
  /**
     * Overload lai ham create model
     * @param {Object} arg
     * @param {ClientID} client
     */
  createTicket(arg, client) {
    return this.create({
      ...arg,
      Customer: client,
    });
  },
};

export default mongoose.model('tickets', TicketSchema);
