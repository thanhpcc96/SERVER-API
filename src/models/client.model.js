import mongoose, { Schema } from "mongoose";
import { hashSync, compareSync } from "bcrypt-nodejs";
import uniqueValidator from "mongoose-unique-validator";
import jwt from "jsonwebtoken";
import constants from "../config/constants";

const ClientUserSchema = new Schema(
  {
    phone: {
      type: String,
      unique: true
    },
    acount_payment: {
      balance: {
        // tai khoan
        type: Number,
        default: 0,
        min: 0
      },
      history_recharge: [
        {
          rechargeTime: {
            type: Date,
            default: Date.now()
          },
          idUser:{
            type: Schema.Types.ObjectId,
            ref: 'users'
          }, // Id nhan vien nhan tien
          amountSend: Number,
          oldBalace: Number,
        }
      ],
      history_transaction: [
        {
          type: Schema.Types.ObjectId,
          ref: "tickets"
        }
      ],
      history_pick_keep_seat: [
        {
          type: Schema.Types.ObjectId,
          ref: "tickets"
        }
      ],
      history_cancel_ticket: [
        {
          type: Schema.Types.ObjectId,
          ref: "tickets"
        }
      ]
    },
    info: {
      fullname:{
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      }
    },
    local: {
      email: {
        type: String,
        required: [true, "email is importable and required"],
        trim: true
      },
      password: {
        type: String,
        required: [true, "Password is re quired"],
        trim: true,
        minlength: [6, "Password must lenght"],
        validate: {
          validator(password) {
            return password.length >= 6 && password.match(/\d+/g);
          },
          message: "{VALUE} is not a vaidl password"
        }
      },
      photo: {
        type: String,
        trim: true
      },
      resetPasswordToken: {
        // danh cho khoi phuc mat khau
        type: String,
        trim: true
      },
      resetPasswordExpires: {
        type: Date
      }
    },
    scoreFriendly: {
      type: Number,
      default: 10
    },
    tokenPush:{
      type: String
    },
    status: String // ACTIVE, DEACTIVE, SUSPENDED
  },
  { timestamps: true }
);

/*
 ** setup middleware mongoose cho hanh dong SAVE thi tu dong hash pass
 */
ClientUserSchema.plugin(uniqueValidator, {
  message: "{VALUE} da ton tai"
});
ClientUserSchema.pre("save", function(next) {
  if (this.isModified("local.password")) {
    this.local.password = this._hashPassword(this.local.password);
  }
  return next();
});

ClientUserSchema.methods = {
  /**
 * Bam mat khau nguoi dung
 *
 * @private
 * @param {String} password - password nguoi dung
 * @returns {String} password - password sau khi bam
 */
  _hashPassword(password) {
    return hashSync(password);
  },
  /**
  * Chung thuc user
  *
  * @public
  * @param {String} password - thuc hien hash pass
  * @returns {Boolean} isMatch - ket qua so sanh
  */
  authenticateClientUser(password) {
    return compareSync(password, this.local.password);
  },
  /**
  * Generate ra jwt token cho viec chung thuc nguoi dung
  *
  * @public
  * @returns {String} token - tra ve JWT token
  */
  createToken() {
    return jwt.sign(
      {
        _id: this._id
      },
      constants.JWT_SECRET
    );
  },
  /**
    * chuyển dữ liệu người dùng về dạng JSON
    *
    * @public
    * @returns {Object} User - ready for auth
     */
  toAuthJSON() {
    return {
      _id: this._id,
      email: this.local.email,
      token: `JWT ${this.createToken()}`
    };
  },
  /**
   * Parse the user object in data we wanted to send
   *
   * @public
   * @returns {Object} User - ready for populate
   */
  // toJSON() {
  //   return {
  //     _id: this._id,
  //     local: this.local
  //   };
  // }
};
export default mongoose.model("clients", ClientUserSchema);
